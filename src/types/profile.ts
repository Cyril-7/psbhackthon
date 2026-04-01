import { User, IndianRupee, BarChart3, Home, Target, Shield } from 'lucide-react';

export interface Asset {
  type: string;
  value: string;
}

export interface Goal {
  type: string;
  target: string;
  years: string;
}

export interface ProfileData {
  fullName: string;
  age: string;
  city: string;
  jobType: string;
  monthlySalary: string;
  sideIncome: string;
  expenseMode: 'auto' | 'manual' | null;
  expenses: { dining: string; rent: string; shopping: string; travel: string; };
  assets: Asset[];
  goals: Goal[];
  riskPreference: 'safe' | 'high' | null;
  marketDropReaction: 'sell' | 'hold' | 'buy' | null;
}

export const defaultProfile: ProfileData = {
  fullName: 'Cyril T Johnson',
  age: '34',
  city: 'Bangalore',
  jobType: 'Salaried',
  monthlySalary: '125000',
  sideIncome: '15000',
  expenseMode: null,
  expenses: { dining: '15000', rent: '35000', shopping: '12000', travel: '8000' },
  assets: [
    { type: 'Bank Balance', value: '250000' },
    { type: 'Mutual Funds', value: '1200000' },
  ],
  goals: [
    { type: 'Home', target: '15000000', years: '10' },
  ],
  riskPreference: null,
  marketDropReaction: null,
};

export const STEPS = [
  { id: 0, label: 'Basic Info', icon: User },
  { id: 1, label: 'Income', icon: IndianRupee },
  { id: 2, label: 'Expenses', icon: BarChart3 },
  { id: 3, label: 'Assets', icon: Home },
  { id: 4, label: 'Goals', icon: Target },
  { id: 5, label: 'Risk Profile', icon: Shield },
];
