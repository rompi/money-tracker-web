'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { AddTransactionDialog } from '@/components/ui/addtransactiondialog'
import { useState } from 'react'
ChartJS.register(ArcElement, Tooltip, Legend)

const initialTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Grocery Shopping',
    amount: -54.75,
    category: 'Groceries',
    date: '2025-03-25',
    type: 'expense',
  },
  {
    id: '2',
    title: 'Salary',
    amount: 3000,
    category: 'Income',
    date: '2025-03-25',
    type: 'income',
  },
  {
    id: '3',
    title: 'Netflix Subscription',
    amount: -12.99,
    category: 'Entertainment',
    date: '2025-03-24',
    type: 'expense',
  },
]

export default function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  const summary = {
    income: transactions.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0),
    expense: transactions.filter((t) => t.type === 'expense').reduce((acc, t) => acc + Math.abs(t.amount), 0),
  }

  const pieData = {
    labels: ['Groceries', 'Entertainment'],
    datasets: [
      {
        label: 'Expenses',
        data: [54.75, 12.99],
        backgroundColor: ['#f87171', '#facc15'],
        borderWidth: 1,
      },
    ],
  }
  return (
    <main className="flex flex-col items-center gap-6 px-4 py-6">
      <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">${summary.income.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">${summary.expense.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${(summary.income - summary.expense).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid w-full max-w-4xl grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <AddTransactionDialog onAdd={(newTx) => setTransactions([...transactions, newTx])} />
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {transactions.map((tx, idx) => (
                <div key={tx.id} className="space-y-1 py-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{tx.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.category} • {tx.date}
                      </p>
                    </div>
                    <div
                      className={`text-right font-semibold ${
                        tx.amount < 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                    </div>
                  </div>
                  {idx < transactions.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-xs mx-auto">
              <Pie data={pieData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
