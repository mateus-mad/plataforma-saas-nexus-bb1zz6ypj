import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  importBundle,
  uploadArchive,
  validateBundle,
  verifyArchive,
  type ImportBundle,
  type ImportProgress,
  type MigrationBatch,
} from './migration-client'

export default function MigrationConsole() {
  const { user } = useAuth()
  const [batches, setBatches] = useState<MigrationBatch[]>([])
  const [batchId, setBatchId] = useState('')
  const [bundle, setBundle] = useState<ImportBundle | null>(null)
  const [files, setFiles] = useState<Partial<Record<'database_export' | 'storage_export', File>>>(
    {},
  )
  const [verified, setVerified] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState<ImportProgress | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const generation = useRef(0)
  const selected = batches.find((b) => b.id === batchId)
  useEffect(() => {
    const requestCounter = generation
    const request = ++generation.current
    setBatches([])
    setBatchId('')
    setBundle(null)
    setFiles({})
    setProgress(null)
    setVerified({})
    setError('')
    setMessage('')
    setBusy(false)
    setLoading(true)
    if (!user?.id || pb.authStore.record?.id !== user.id) {
      setLoading(false)
      return
    }
    pb.collection('_orbix_import_batches')
      .getFullList<MigrationBatch>({ sort: '-created', requestKey: null })
      .then((rows) => {
        if (request === generation.current) {
          setBatches(rows)
          setBatchId(rows[0]?.id || '')
        }
      })
      .catch(() => {
        if (request === generation.current)
          setError('A consulta aos lotes não está disponível para esta sessão.')
      })
      .finally(() => {
        if (request === generation.current) setLoading(false)
      })
    return () => {
      requestCounter.current++
    }
  }, [user?.id])
  const run = async (action: (isCurrent: () => boolean) => Promise<void>) => {
    const request = generation.current
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await action(() => request === generation.current)
    } catch (e) {
      if (request === generation.current)
        setError(e instanceof Error ? e.message : 'A operação foi interrompida.')
    } finally {
      if (request === generation.current) setBusy(false)
    }
  }
  const chooseBundle = async (file?: File) => {
    setBundle(null)
    setProgress(null)
    setVerified({})
    if (!file || !selected) return
    await run(async (isCurrent) => {
      if (file.size > 52428800) throw new Error('O pacote JSON excede o limite permitido.')
      const valid = await validateBundle(JSON.parse(await file.text()), selected)
      if (isCurrent()) {
        setBundle(valid)
        setMessage('Pacote e hashes locais conferidos. Pronto para conciliar com o destino.')
      }
    })
  }
  const updateBatch = (batch: MigrationBatch) =>
    setBatches((rows) => rows.map((r) => (r.id === batch.id ? batch : r)))
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <Link to="/app/configuracoes" className="text-sm text-muted-foreground">
          Voltar às configurações
        </Link>
        <h1 className="text-2xl font-semibold">Migração ORBIX</h1>
        <p className="text-sm text-muted-foreground">
          Entrada e conferência de dados no Skip Cloud, com autorização por lote.
        </p>
      </div>
      {loading ? (
        <p role="status">Consultando autorização dos lotes...</p>
      ) : !selected ? (
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold">Acesso ao lote pendente</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta conta ainda não tem um lote autorizado para migração. A ausência de acesso não
              indica ausência de dados no destino.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Lote de entrada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="block text-sm">
                Lote autorizado
                <select
                  aria-label="Lote autorizado"
                  className="mt-1 block w-full rounded-md border bg-background p-2"
                  disabled={busy}
                  value={batchId}
                  onChange={(e) => {
                    setBatchId(e.target.value)
                    setBundle(null)
                    setFiles({})
                    setProgress(null)
                    setVerified({})
                    setMessage('')
                    setError('')
                  }}
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="text-sm text-muted-foreground">
                Registros previstos: {selected.record_count} · Anexos previstos:{' '}
                {selected.file_count}. A conferência abaixo verifica o conteúdo efetivamente
                gravado.
              </p>
              <p className="rounded-md border bg-muted/40 p-3 text-sm">
                Esta etapa preserva a origem para conferência. A adaptação dos módulos e a
                homologação de suas operações seguem separadamente.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Registros e índice de anexos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block text-sm">
                Pacote de migração (JSON)
                <input
                  key={user?.id + ':' + batchId}
                  aria-label="Pacote de migração (JSON)"
                  type="file"
                  accept=".json,application/json"
                  disabled={busy}
                  className="mt-2 block w-full text-sm"
                  onChange={(e) => void chooseBundle(e.target.files?.[0])}
                />
              </label>
              <Button
                disabled={!bundle || busy}
                onClick={() =>
                  void run(async (isCurrent) => {
                    const result = await importBundle(pb, selected, bundle!, (p) => {
                      if (isCurrent()) setProgress(p)
                    })
                    if (isCurrent()) {
                      setProgress(result)
                      setMessage(
                        'Registros e índice de anexos conferidos no destino. Os arquivos ZIP ainda precisam de conferência própria.',
                      )
                    }
                  })
                }
              >
                Conferir e importar pacote
              </Button>
              {progress && (
                <div role="status" className="space-y-2 text-sm">
                  <progress className="w-full" max={progress.total} value={progress.checked} />
                  <p>
                    Conferidos: {progress.checked}/{progress.total} · Novos: {progress.created} ·
                    Iguais no destino: {progress.skipped}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            {(['database_export', 'storage_export'] as const).map((field) => (
              <Card key={field}>
                <CardHeader>
                  <CardTitle>
                    {field === 'database_export' ? 'Arquivo do banco' : 'Anexos privados'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    ZIP protegido. O tamanho e o hash devem corresponder ao pacote selecionado.
                  </p>
                  {!selected[field] && (
                    <label className="block text-sm">
                      {field === 'database_export'
                        ? 'Arquivo do banco (ZIP)'
                        : 'Anexos privados (ZIP)'}
                      <input
                        key={user?.id + ':' + batchId + ':' + field}
                        aria-label={
                          field === 'database_export'
                            ? 'Arquivo do banco (ZIP)'
                            : 'Anexos privados (ZIP)'
                        }
                        type="file"
                        accept=".zip,application/zip"
                        disabled={busy || !bundle}
                        className="mt-2 block w-full text-sm"
                        onChange={(e) =>
                          setFiles((current) => ({ ...current, [field]: e.target.files?.[0] }))
                        }
                      />
                    </label>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {!selected[field] && (
                      <Button
                        disabled={busy || !bundle || !files[field]}
                        onClick={() =>
                          void run(async (isCurrent) => {
                            const result = await uploadArchive(
                              pb,
                              selected,
                              bundle!,
                              field,
                              files[field]!,
                            )
                            if (isCurrent()) {
                              updateBatch(result)
                              setMessage(
                                'Arquivo enviado. Confira os bytes gravados para concluir esta etapa.',
                              )
                            }
                          })
                        }
                      >
                        Enviar {field === 'database_export' ? 'banco' : 'anexos'}
                      </Button>
                    )}
                    {selected[field] && (
                      <Button
                        variant="outline"
                        disabled={busy || !bundle}
                        onClick={() =>
                          void run(async (isCurrent) => {
                            setVerified((v) => ({ ...v, [field]: false }))
                            await verifyArchive(pb, selected, bundle!, field)
                            if (isCurrent()) {
                              setVerified((v) => ({ ...v, [field]: true }))
                              setMessage('Arquivo protegido conferido com o manifesto.')
                            }
                          })
                        }
                      >
                        Conferir {field === 'database_export' ? 'banco' : 'anexos'}
                      </Button>
                    )}
                  </div>
                  <p className="text-sm">
                    {verified[field]
                      ? 'Arquivo gravado e conferido'
                      : selected[field]
                        ? 'Arquivo gravado; conferência pendente'
                        : 'Envio pendente'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
      {busy && (
        <p role="status" className="text-sm text-muted-foreground">
          Processando. Aguarde o resultado antes de sair desta página.
        </p>
      )}
      {message && (
        <p
          role="status"
          className="rounded-md border border-emerald-600/40 bg-emerald-500/5 p-3 text-sm"
        >
          {message}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 p-3 text-sm text-destructive"
        >
          {error} Os itens já gravados serão conciliados na próxima tentativa.
        </p>
      )}
    </div>
  )
}
