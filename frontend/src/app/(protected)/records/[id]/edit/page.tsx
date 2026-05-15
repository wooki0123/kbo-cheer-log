import { getRecordById } from '@/actions/records'
import { notFound } from 'next/navigation'
import RecordForm from '@/components/records/RecordForm'

export default async function EditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const record = await getRecordById(id)
  if (!record) notFound()

  return <RecordForm initialData={record} recordId={id} />
}
