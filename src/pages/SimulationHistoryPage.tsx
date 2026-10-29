import {
  CalendarClock,
  Clock,
  Sparkles,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { calcMonthlySavings } from '@/utils/simulation'

const formatMoney = (value: number) =>
  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Data não registrada'

export function SimulationHistoryPage() {
  const navigate = useNavigate()
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() =>
    getAllSimulations(),
  )

  const handleDelete = (record: SimulationRecord) => {
    if (!window.confirm(`Excluir a simulação "${record.goalName}"?`)) {
      return
    }

    deleteSimulation(record.id)
    setSimulations((prev) => prev.filter((item) => item.id !== record.id))
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Reveja suas metas anteriores e os diagnósticos gerados pela IA."
      />

      {simulations.length === 0 ? (
        <div className="bg-card flex flex-col items-center gap-4 rounded-2xl p-10 text-center">
          <Clock size={32} className="text-primary" />
          <p className="text-muted-foreground text-sm">
            Você ainda não fez nenhuma simulação.
          </p>
          <Button
            variant="primary"
            icon={TrendingUp}
            onClick={() => void navigate('/')}
          >
            Fazer minha primeira simulação
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {simulations.map((record) => (
            <li
              key={record.id}
              className="bg-card flex items-center gap-4 rounded-2xl p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.12)]"
            >
              <Link
                to={`/resultado/${record.id}`}
                className="min-w-0 flex-1 hover:opacity-80"
              >
                <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
                  <CalendarClock size={14} />
                  {formatDate(record.createdAt)}
                  {record.insight && (
                    <span className="text-primary flex items-center gap-1 font-semibold">
                      <Sparkles size={12} /> Diagnóstico pronto
                    </span>
                  )}
                </div>
                <p className="text-foreground truncate text-lg font-semibold">
                  {record.goalName}
                </p>
                <p className="text-muted-foreground text-sm">
                  R$ {record.goalAmount} em {record.goalDeadline} meses ·{' '}
                  {formatMoney(calcMonthlySavings(record))}/mês
                </p>
              </Link>
              <Button
                variant="ghost"
                icon={Trash2}
                aria-label={`Excluir simulação ${record.goalName}`}
                onClick={() => handleDelete(record)}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
