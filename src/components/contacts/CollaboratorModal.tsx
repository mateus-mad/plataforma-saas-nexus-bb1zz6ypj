import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
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
}: {
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const [activeTab, setActiveTab] = useState('pessoal')
  const [isEditing, setIsEditing] = useState(true)
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
  } = useCollaboratorForm()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleSave = () => {
    if (!validate()) {
      toast({
        variant: 'destructive',
        title: 'Erros de Validação',
        description:
          'Por favor, preencha corretamente os campos obrigatórios marcados em vermelho.',
      })
      return
    }
    toast({
      title: 'Dados Atualizados',
      description: 'Sincronização persistente realizada com sucesso na nuvem.',
    })
    setIsEditing(false)
  }

  const handleOCRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0]
      const success = await processOCR(file)
      if (success) {
        toast({
          title: 'Inteligência Artificial (OCR)',
          description:
            'Foto e dados extraídos. Verificamos a validade dos documentos publicamente.',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro de Leitura',
          description: 'Não foi possível extrair os dados do documento.',
        })
      }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px] h-[95vh] flex flex-col p-0 gap-0 bg-slate-50 border-none rounded-2xl shadow-2xl overflow-hidden [&>button]:hidden">
        <div className="p-5 pb-0 bg-white border-b border-slate-200 shrink-0 relative z-10">
          <button
            onClick={() => onOpenChange(false)}
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
              <Button
                variant={isEditing ? 'outline' : 'default'}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-9 transition-all font-semibold shadow-sm"
              >
                {isEditing ? <Eye className="w-4 h-4 mr-2" /> : <Edit2 className="w-4 h-4 mr-2" />}
                {isEditing ? 'Modo Leitura' : 'Ativar Edição'}
              </Button>
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

          <div className="flex items-center gap-2 overflow-x-auto pb-3 mt-6 px-1 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full">
            {TABS.map((tab) => {
              const tabHasError = Object.keys(errors).some((k) => k.startsWith(tab.id))
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex flex-col min-w-[100px] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shrink-0 border border-transparent shadow-sm',
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-100'
                      : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 border-slate-200',
                    tabHasError && activeTab !== tab.id && 'border-rose-200 text-rose-600',
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div className="flex items-center gap-1.5">
                      <tab.icon
                        className={cn(
                          'w-4 h-4',
                          activeTab === tab.id ? 'text-blue-600' : 'text-slate-400',
                          tabHasError && 'text-rose-500',
                        )}
                      />
                      <span>{tab.label}</span>
                    </div>
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
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {isEditing && (
              <div className="bg-white border border-blue-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                <div className="absolute top-0 right-0 w-64 h-full bg-blue-50/50 -skew-x-12 translate-x-10 -z-10 group-hover:bg-blue-100/50 transition-colors"></div>

                <div className="flex items-center gap-4 pl-2 z-10 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0 shadow-inner">
                    <ScanLine className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">
                      Preenchimento e Compliance (OCR)
                    </h4>
                    <p className="text-sm text-slate-500">
                      Faça upload de CNH/RG para extração automática e validação imediata em bases
                      públicas.
                    </p>
                  </div>
                </div>

                <div className="z-10 w-full sm:w-auto">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto shadow-md transition-all font-semibold"
                    disabled={isProcessingOCR}
                  >
                    {isProcessingOCR ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verificando Dados...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4 mr-2" /> Extrair de Documento
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
                  onChange={(f, v) => updateData('pessoal', f, v)}
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
              onClick={() => onOpenChange(false)}
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
  )
}
