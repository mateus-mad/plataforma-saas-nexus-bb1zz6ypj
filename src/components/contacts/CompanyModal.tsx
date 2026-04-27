import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCompanyForm } from '@/hooks/useCompanyForm'
import { useToast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import {
  X,
  Building2,
  MapPin,
  Phone,
  DollarSign,
  Wallet,
  FileSignature,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ScanLine,
} from 'lucide-react'
import { cn } from '@/lib/utils'

import { CompanyDadosTab, CompanyContatoTab, CompanyAddressTab } from './tabs/CompanyTabs'
import { CompanyFinanceiroTab } from './tabs/CompanyFinancialTabs'
import { CompanyBankingTab } from './tabs/CompanyBankingTab'
import { CompanyAgreementsTab } from './tabs/CompanyAgreementsTab'
import { OCRReviewModal } from './OCRReviewModal'
import { checkImageQuality } from '@/lib/image-quality'
import { checkOCRStatus } from '@/services/ocr'

export default function CompanyModal({
  open,
  onOpenChange,
  type = 'client',
  entityId = null,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  type?: 'client' | 'supplier'
  entityId?: string | null
}) {
  const [activeTab, setActiveTab] = useState('dados')
  const [showDirtyWarning, setShowDirtyWarning] = useState(false)
  const [lowQualityFile, setLowQualityFile] = useState<File | null>(null)
  const [isDraggingOCR, setIsDraggingOCR] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    data,
    updateData,
    progress,
    globalProgress,
    errors,
    validate,
    saveEntity,
    saveStatus,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    startOCRProcess,
    isProcessingOCR,
    isReviewingOCR,
    setIsReviewingOCR,
    ocrDraft,
    ocrFile,
    confirmOCRData,
  } = useCompanyForm(type, entityId)
  const { toast } = useToast()
  const [ocrConfigured, setOcrConfigured] = useState(true)

  useEffect(() => {
    checkOCRStatus().then((setConfigured) => setOcrConfigured(setConfigured))
  }, [])

  useEffect(() => {
    if (open) {
      setActiveTab('dados')
    }
  }, [open, entityId])

  const TABS = [
    { id: 'dados', label: 'Dados Corporativos', prog: progress.dados, icon: Building2 },
    { id: 'endereco', label: 'Endereço', prog: progress.endereco, icon: MapPin },
    { id: 'contato', label: 'Contatos', prog: progress.contato, icon: Phone },
    {
      id: 'financeiro',
      label: 'Financeiro / Limites',
      prog: progress.financeiro,
      icon: DollarSign,
    },
    { id: 'bancario', label: 'Bancário / PIX', prog: progress.bancario, icon: Wallet },
    { id: 'acordos', label: 'Acordos (SLA)', prog: progress.acordos, icon: FileSignature },
  ]

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges) {
      setShowDirtyWarning(true)
    } else {
      onOpenChange(false)
    }
  }

  const processFile = async (file: File) => {
    try {
      const res = await startOCRProcess(file)
      if (!res.success) {
        toast({
          variant: 'destructive',
          title: 'Falha no Processamento',
          description:
            res.description || 'Ocorreu uma falha no OCR. Por favor, preencha manualmente.',
        })
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro no processamento. Tente novamente.',
      })
    }
    setLowQualityFile(null)
  }

  const handleFileDropOrSelect = async (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Formato inválido',
        description: 'Envie um arquivo PDF, PNG ou JPG.',
      })
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Arquivo muito grande',
        description: 'Limite de 20MB.',
      })
      return
    }

    const { isLowQuality } = await checkImageQuality(file)
    if (isLowQuality && file.type !== 'application/pdf') {
      setLowQualityFile(file)
    } else {
      await processFile(file)
    }
  }

  const handleOCRDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOCR(false)
    if (e.dataTransfer.files?.length) {
      handleFileDropOrSelect(e.dataTransfer.files[0])
    }
  }

  const handleOCRUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFileDropOrSelect(e.target.files[0])
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!validate()) {
      toast({
        variant: 'destructive',
        title: 'Erros de Validação',
        description: 'Verifique os campos obrigatórios.',
      })
      return
    }
    const success = await saveEntity()
    if (success) {
      toast({ title: 'Dados Salvos', description: 'O registro foi salvo com sucesso na nuvem.' })
      onOpenChange(false)
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro de Sincronização',
        description: 'Ocorreu um erro ao salvar os dados no PocketBase.',
      })
    }
  }

  const getProgressColor = (prog: number | null) => {
    if (prog === null) return 'bg-slate-200'
    if (prog === 100) return 'bg-emerald-500'
    if (prog > 50) return 'bg-amber-400'
    return 'bg-blue-500'
  }

  const hasErrors = Object.keys(errors).length > 0

  const getHighlightStyles = () => {
    if (!data?.extraction_metadata?.auto_filled?.length) return null
    const selectors = data.extraction_metadata.auto_filled
      .map((field: string) => `[name="${field}"], [id="${field}"]`)
      .join(', ')
    return (
      <style>{`
        ${selectors} {
          border-color: #22c55e !important;
          background-color: #f0fdf4 !important;
          transition: all 0.3s ease;
        }
      `}</style>
    )
  }

  return (
    <>
      {getHighlightStyles()}
      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) handleCloseAttempt()
        }}
      >
        <DialogContent className="max-w-[1100px] h-[95vh] flex flex-col p-0 gap-0 bg-slate-50 border-none rounded-2xl shadow-2xl overflow-hidden [&>button]:hidden">
          <div className="p-5 pb-0 bg-white border-b border-slate-200 shrink-0 relative z-10">
            <button
              onClick={handleCloseAttempt}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pr-12">
              <div>
                <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-500" />
                  {entityId
                    ? type === 'supplier'
                      ? 'Editar Fornecedor'
                      : 'Editar Cliente'
                    : type === 'supplier'
                      ? 'Novo Fornecedor'
                      : 'Novo Cliente'}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-1">
                  Preencha os dados corporativos e regras financeiras da empresa.
                </DialogDescription>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-3">
                  {!ocrConfigured && (
                    <span className="text-xs text-amber-600 font-medium hidden sm:block bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                      API OCR não configurada.
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-blue-200 text-blue-700 hover:bg-blue-50 bg-blue-50/50 hidden sm:flex"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessingOCR}
                  >
                    {isProcessingOCR ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ScanLine className="w-4 h-4 mr-2" />
                    )}
                    {isProcessingOCR ? 'Processando documento...' : 'Ler Cartão CNPJ'}
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleOCRUpload}
                  />
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-inner">
                    {saveStatus === 'saving' ? (
                      <span className="text-xs text-blue-600 font-semibold flex items-center">
                        <Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Salvando...
                      </span>
                    ) : saveStatus === 'saved' ? (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1.5" /> Salvo
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 font-medium">Preenchimento:</span>
                    )}
                    {saveStatus === 'idle' && (
                      <>
                        <Progress
                          value={globalProgress}
                          className="w-20 h-1.5 bg-slate-200 [&>div]:bg-blue-600"
                        />
                        <span className="text-sm font-bold text-slate-700">{globalProgress}%</span>
                      </>
                    )}
                  </div>
                </div>
                {!ocrConfigured && (
                  <div className="text-[10px] text-amber-600 hidden sm:block max-w-[220px] text-right">
                    Configure a <code className="font-mono text-amber-800">OPENAI_API_KEY</code> nas{' '}
                    <strong>Integrações</strong> (☁️) no painel do Skip para ativar a extração.
                  </div>
                )}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
              <TabsList className="h-auto bg-transparent w-full justify-start overflow-x-auto pb-3 px-1 custom-scrollbar gap-2">
                {TABS.map((tab) => {
                  const tabHasError = Object.keys(errors).some((k) => k.startsWith(tab.id))
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={cn(
                        'flex flex-col min-w-[130px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shrink-0 shadow-sm border',
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-blue-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700'
                          : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200 data-[state=active]:bg-white',
                        tabHasError && activeTab !== tab.id && 'border-rose-200 text-rose-600',
                      )}
                    >
                      <div className="flex items-center gap-1.5 w-full mb-1">
                        <tab.icon
                          className={cn(
                            'w-4 h-4',
                            activeTab === tab.id ? 'text-blue-600' : 'text-slate-400',
                            tabHasError && 'text-rose-500',
                          )}
                        />
                        <span>{tab.label}</span>
                      </div>
                      {tab.prog !== null && (
                        <div className="w-full flex items-center gap-2 mt-1">
                          <div className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full', getProgressColor(tab.prog))}
                              style={{ width: `${tab.prog}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold">{tab.prog}%</span>
                        </div>
                      )}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
            <div className="max-w-4xl mx-auto min-h-full">
              {activeTab === 'dados' && (
                <CompanyDadosTab
                  data={data?.dados || {}}
                  onChange={(f: string, v: any) => updateData('dados', f, v)}
                  onUpdateSection={(section: string, f: string, v: any) =>
                    updateData(section, f, v)
                  }
                  errors={errors}
                  readOnly={false}
                />
              )}
              {activeTab === 'endereco' && (
                <CompanyAddressTab
                  data={data?.endereco || {}}
                  onChange={(f: string, v: any) => updateData('endereco', f, v)}
                  errors={errors}
                  readOnly={false}
                />
              )}
              {activeTab === 'contato' && (
                <CompanyContatoTab
                  data={data?.contato || {}}
                  onChange={(f: string, v: any) => updateData('contato', f, v)}
                  errors={errors}
                  readOnly={false}
                />
              )}
              {activeTab === 'financeiro' && (
                <CompanyFinanceiroTab
                  data={data?.financeiro || {}}
                  type={type}
                  onChange={(f: string, v: any) => updateData('financeiro', f, v)}
                  errors={errors}
                  readOnly={false}
                />
              )}
              {activeTab === 'bancario' && (
                <CompanyBankingTab
                  data={data || {}}
                  onChange={(section: string, v: any) => updateData(section, null, v)}
                  readOnly={false}
                />
              )}
              {activeTab === 'acordos' && (
                <CompanyAgreementsTab
                  data={data?.acordos || {}}
                  onChange={(f: string, v: any) => updateData('acordos', f, v)}
                  readOnly={false}
                />
              )}
            </div>
          </div>

          <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex justify-between items-center shrink-0 z-10">
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500">
                <span className="text-rose-500 font-bold">*</span> Obrigatórios
              </p>
              {hasErrors && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 ml-4 bg-rose-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> Verifique os erros
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleCloseAttempt}
                className="font-semibold text-slate-600"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-8 font-semibold"
              >
                Salvar Cadastro
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <OCRReviewModal
        open={isReviewingOCR}
        onOpenChange={setIsReviewingOCR}
        ocrDraft={ocrDraft}
        ocrFile={ocrFile}
        existingData={{
          docs: { cpf: data?.dados?.documento },
          pessoal: { name: data?.dados?.nomeRazao },
        }}
        onConfirm={confirmOCRData}
      />

      <AlertDialog
        open={!!lowQualityFile}
        onOpenChange={(open) => !open && setLowQualityFile(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5" /> Qualidade de Imagem
            </AlertDialogTitle>
            <AlertDialogDescription>
              A imagem selecionada parece ter baixa qualidade. Deseja tentar a extração mesmo assim?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setLowQualityFile(null)}>
              Preencher Manualmente
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => lowQualityFile && processFile(lowQualityFile)}
            >
              Tentar Extrair (OCR)
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDirtyWarning} onOpenChange={setShowDirtyWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-rose-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Alterações Não Salvas
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você possui alterações no cadastro que não foram salvas na nuvem. Deseja descartar
              essas alterações e fechar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDirtyWarning(false)}>
              Continuar Editando
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDirtyWarning(false)
                onOpenChange(false)
                setHasUnsavedChanges(false)
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Descartar e Fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
