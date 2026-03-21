import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Briefcase,
  DollarSign,
  Heart,
  Shield,
  CalendarDays,
  Building2,
  History,
  Paperclip,
  User,
  FileText,
  MapPin,
  Phone,
  Eye,
  Edit2,
  AlertTriangle,
  ScanLine,
  UploadCloud,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCollaboratorForm } from '@/hooks/useCollaboratorForm'
import { checkImageQuality } from '@/lib/image-quality'
import PersonalInfoTab from './tabs/PersonalInfoTab'
import HistoryTab from './tabs/HistoryTab'
import ESocialTab from './tabs/ESocialTab'
import AttachmentsTab from './tabs/AttachmentsTab'
import {
  DocsTab,
  AddressTab,
  ContactTab,
  WorkTab,
  BenefitsTab,
  SalaryTab,
  ChargesTab,
  VacationTab,
} from './tabs/FormTabs'

export default function CollaboratorModal({
  open,
  onOpenChange,
  entityId,
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
  entityId: string | null
}) {
  const [activeTab, setActiveTab] = useState('pessoal')
  const [isEditing, setIsEditing] = useState(!entityId)
  const [isDraggingOCR, setIsDraggingOCR] = useState(false)
  const [docType, setDocType] = useState('RG')
  const [lowQualityFile, setLowQualityFile] = useState<File | null>(null)
  const [showDirtyWarning, setShowDirtyWarning] = useState(false)

  const {
    data,
    updateData,
    progress,
    globalProgress,
    errors,
    validate,
    processOCR,
    isProcessingOCR,
    fetchESocial,
    isFetchingESocial,
    saveStatus,
    saveEntity,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  } = useCollaboratorForm(entityId)

  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setActiveTab('pessoal')
      setIsEditing(!entityId)
    }
  }, [open, entityId])

  const TABS = [
    { id: 'pessoal', label: 'Pessoal', prog: progress.pessoal, icon: User },
    { id: 'docs', label: 'Docs/Compliance', prog: progress.docs, icon: FileText },
    { id: 'endereco', label: 'Endereço', prog: progress.endereco, icon: MapPin },
    { id: 'contato', label: 'Contato', prog: progress.contato, icon: Phone },
    { id: 'trabalho', label: 'Trabalho', prog: progress.trabalho, icon: Briefcase },
    { id: 'salario', label: 'Salário', prog: progress.salario, icon: DollarSign },
    { id: 'beneficios', label: 'Benefícios', prog: progress.beneficios, icon: Heart },
    { id: 'encargos', label: 'Encargos', prog: progress.encargos, icon: Shield },
    { id: 'ferias', label: 'Férias', prog: progress.ferias, icon: CalendarDays },
    { id: 'esocial', label: 'eSocial', prog: progress.esocial, icon: Building2 },
    { id: 'historico', label: 'Histórico', prog: null, icon: History },
    { id: 'anexos', label: 'Anexos', prog: null, icon: Paperclip },
  ]

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges && isEditing) {
      setShowDirtyWarning(true)
    } else {
      onOpenChange(false)
    }
  }

  const handleSave = async () => {
    if (!validate()) {
      toast({
        variant: 'destructive',
        title: 'Erros de Validação',
        description: 'Por favor, preencha corretamente os campos obrigatórios.',
      })
      return
    }

    const success = await saveEntity()
    if (success) {
      toast({
        title: 'Dados Atualizados',
        description: 'Sincronização persistente realizada com sucesso na nuvem.',
      })
      setIsEditing(false)
      onOpenChange(false)
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro de Sincronização',
        description: 'Ocorreu um erro ao salvar na nuvem.',
      })
    }
  }

  const processFile = async (file: File) => {
    try {
      const result = await processOCR(file, docType)
      if (result && result.success) {
        toast({
          title: 'Inteligência Artificial (OCR)',
          description: 'Dados extraídos e mapeados com sucesso.',
        })
      }
    } catch (e) {
      // Handled in the hook itself
    }
    setLowQualityFile(null)
  }

  const handleFileDropOrSelect = async (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      toast({
        variant: 'destructive',
        title: 'Formato inválido',
        description: 'Por favor, envie um arquivo PDF, PNG ou JPG.',
      })
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: 'Arquivo muito grande',
        description: `O arquivo excede o limite de 20MB.`,
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

  const getProgressColor = (prog: number | null) => {
    if (prog === null) return 'bg-slate-200'
    if (prog === 100) return 'bg-emerald-500'
    if (prog > 50) return 'bg-amber-400'
    return 'bg-blue-500'
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <>
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
                  <User className="w-5 h-5 text-slate-500" />{' '}
                  {isEditing ? 'Editar Ficha Funcional' : 'Visualizar Ficha Funcional'}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 mt-1">
                  Autosalvamento ativo. Gerencie todos os dados da ficha integrados à nuvem e ao
                  eSocial.
                </DialogDescription>
              </div>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {entityId && (
                  <Button
                    variant={isEditing ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="h-9 transition-all font-semibold shadow-sm"
                  >
                    {isEditing ? (
                      <Eye className="w-4 h-4 mr-2" />
                    ) : (
                      <Edit2 className="w-4 h-4 mr-2" />
                    )}
                    {isEditing ? 'Modo Leitura' : 'Ativar Edição'}
                  </Button>
                )}
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 shadow-inner">
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
                        'flex flex-col min-w-[110px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shrink-0 shadow-sm border',
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

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              {isEditing && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDraggingOCR(true)
                  }}
                  onDragLeave={() => setIsDraggingOCR(false)}
                  onDrop={handleOCRDrop}
                  className={cn(
                    'bg-white border rounded-xl p-4 mb-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm relative overflow-hidden group transition-all',
                    isDraggingOCR ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-blue-200',
                  )}
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                  <div className="absolute top-0 right-0 w-64 h-full bg-blue-50/50 -skew-x-12 translate-x-10 -z-10 group-hover:bg-blue-100/50 transition-colors"></div>

                  <div className="flex items-center gap-4 pl-2 z-10 w-full lg:w-auto">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                      <ScanLine className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">
                        Preenchimento e Compliance (OCR)
                      </h4>
                      <p className="text-sm text-slate-500">
                        Selecione o tipo e arraste um documento para extração automática.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 z-10 w-full lg:w-auto">
                    <Select value={docType} onValueChange={setDocType} disabled={isProcessingOCR}>
                      <SelectTrigger className="w-full sm:w-[140px] bg-white shadow-sm font-medium">
                        <SelectValue placeholder="Documento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RG">RG</SelectItem>
                        <SelectItem value="CNH">CNH</SelectItem>
                        <SelectItem value="Passaporte">Passaporte</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto shadow-md transition-all font-semibold"
                      disabled={isProcessingOCR}
                    >
                      {isProcessingOCR ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 mr-2" /> Extrair Dados
                        </>
                      )}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleOCRUpload}
                    />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm min-h-full">
                {activeTab === 'pessoal' && (
                  <PersonalInfoTab
                    data={data.pessoal}
                    onChange={(f, v, file) => updateData('pessoal', f, v, file)}
                    errors={errors}
                    readOnly={!isEditing}
                  />
                )}
                {activeTab === 'docs' && (
                  <DocsTab
                    data={data.docs}
                    onChange={(f: string, v: string) => updateData('docs', f, v)}
                    errors={errors}
                    readOnly={!isEditing}
                  />
                )}
                {activeTab === 'endereco' && (
                  <AddressTab
                    data={data.endereco}
                    onChange={(f: string, v: string) => updateData('endereco', f, v)}
                    errors={errors}
                    readOnly={!isEditing}
                  />
                )}
                {activeTab === 'contato' && (
                  <ContactTab
                    data={data.contato}
                    onChange={(f: string, v: string) => updateData('contato', f, v)}
                    errors={errors}
                    readOnly={!isEditing}
                  />
                )}
                {activeTab === 'trabalho' && (
                  <WorkTab
                    data={data.trabalho}
                    onChange={(f: string, v: string) => updateData('trabalho', f, v)}
                    errors={errors}
                    readOnly={!isEditing}
                  />
                )}
                {activeTab === 'salario' && (
                  <SalaryTab
                    data={data.salario}
                    onChange={(f: string, v: string) => updateData('salario', f, v)}
                    errors={errors}
                    readOnly={!isEditing}
                  />
                )}
                {activeTab === 'beneficios' && (
                  <BenefitsTab
                    data={data.beneficios}
                    onChange={(f: string, v: string) => updateData('beneficios', f, v)}
                    errors={errors}
                    readOnly={!isEditing}
                  />
                )}
                {activeTab === 'encargos' && (
                  <ChargesTab
                    data={data.encargos}
                    onChange={(f: string, v: string) => updateData('encargos', f, v)}
                    errors={errors}
                    readOnly={!isEditing}
                  />
                )}
                {activeTab === 'ferias' && (
                  <VacationTab
                    data={data.ferias}
                    onChange={(f: string, v: string) => updateData('ferias', f, v)}
                    errors={errors}
                    readOnly={!isEditing}
                  />
                )}
                {activeTab === 'esocial' && (
                  <ESocialTab
                    data={data.esocial}
                    onChange={(f, v) => updateData('esocial', f, v)}
                    errors={errors}
                    readOnly={!isEditing}
                    onFetchESocial={fetchESocial}
                    isFetchingESocial={isFetchingESocial}
                  />
                )}
                {activeTab === 'historico' && <HistoryTab />}
                {activeTab === 'anexos' && (
                  <AttachmentsTab
                    data={data.anexos}
                    onChange={(v) => updateData('anexos', 'all', v)}
                    readOnly={!isEditing}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="p-4 sm:px-6 bg-white border-t border-slate-200 flex justify-between items-center shrink-0 z-10">
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-500">
                <span className="text-rose-500 font-bold">*</span> Obrigatórios
              </p>
              {hasErrors && (
                <p className="text-xs font-semibold text-rose-600 flex items-center gap-1 ml-4 bg-rose-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> Verifique os erros nas abas
                </p>
              )}
            </div>
            <div className="flex justify-end gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleCloseAttempt}
                className="font-semibold text-slate-600 shadow-sm"
              >
                Fechar Ficha
              </Button>
              {isEditing && (
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-8 font-semibold"
                >
                  Garantir Dados na Nuvem
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              A imagem selecionada parece ter baixa qualidade (muito escura ou muito clara) para
              leitura automática pelo OCR. Você deseja tentar a extração mesmo assim ou prefere
              preencher manualmente?
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
              Você possui alterações na ficha que não foram salvas na nuvem. Deseja descartar essas
              alterações e fechar?
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
                if (entityId) loadEntity(entityId)
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
