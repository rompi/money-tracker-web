'use client'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState, useEffect } from 'react'

export type Transaction = {
  id: string
  title: string
  amount: number
  category: string
  date: string
  type: 'income' | 'expense'
}

type Props = {
  onAdd: (t: Transaction) => void
}

export function AddTransactionDialog({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [error, setError] = useState<string | null>(null)
  const [today, setToday] = useState('')

  useEffect(() => {
    const now = new Date()
    setToday(now.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    // Automatically prefix amount as negative if type is 'expense'
    if (type === 'expense' && amount && !amount.startsWith('-')) {
      setAmount(`-${amount.replace('-', '')}`)
    } else if (type === 'income' && amount.startsWith('-')) {
      setAmount(amount.replace('-', ''))
    }
  }, [type])

  function isValidAmount(value: string) {
    const num = parseFloat(value)
    return num !== 0 && Math.abs(num) <= 99999999
  }

  function isValidDate(value: string) {
    return new Date(value) <= new Date()
  }

  function handleSubmit() {
    if (!title || !amount || !category || !date || !type) {
      setError('All fields are required')
      return
    }
    
    if (!isValidAmount(amount)) {
      setError('Amount must be a positive number less than or equal to 99,999,999')
      return
    }

    if (!isValidDate(date)) {
      setError('Date cannot be in the future')
      return
    }

    let parsedAmount = parseFloat(amount)
    if (type === 'expense' && parsedAmount > 0) {
      parsedAmount *= -1
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      title,
      amount: parseFloat(parsedAmount.toFixed(2)),
      category,
      date,
      type,
    }
    onAdd(transaction)
    setTitle('')
    setAmount('')
    setCategory('')
    setDate('')
    setType('expense')
    setError(null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              max={99999999}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="gift">Gift</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={today} />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as 'income' | 'expense')}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
