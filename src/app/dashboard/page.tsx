import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import StudentDashboard from './StudentDashboard'

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  return <StudentDashboard />
}
