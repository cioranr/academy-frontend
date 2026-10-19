'use client'
import { useEffect, useState } from 'react'
import { getSpecialties } from '@/lib/api'

export interface SpecialtyOption { value: string; label: string }

// Used until the API responds (or if it fails), so the select is never empty.
const FALLBACK: SpecialtyOption[] = [
  { value: 'cardiologie', label: 'Cardiologie' },
  { value: 'chirurgie', label: 'Chirurgie cardiovasculară' },
  { value: 'chirurgie-generala', label: 'Chirurgie generală' },
  { value: 'chirurgie-plastica', label: 'Chirurgie plastică' },
  { value: 'oncologie', label: 'Oncologie' },
  { value: 'radiologie', label: 'Radiologie' },
  { value: 'radioterapie', label: 'Radioterapie' },
  { value: 'rezidenti', label: 'Rezidenți' },
  { value: 'alta', label: 'Altă specialitate' },
]

export function useSpecialties(): SpecialtyOption[] {
  const [list, setList] = useState<SpecialtyOption[]>(FALLBACK)

  useEffect(() => {
    getSpecialties()
      .then(all => { if (all.length) setList(all.map(s => ({ value: s.value, label: s.label }))) })
      .catch(() => {})
  }, [])

  return list
}
