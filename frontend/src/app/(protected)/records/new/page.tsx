import { getProfile } from '@/actions/profile'
import RecordForm from '@/components/records/RecordForm'

export default async function NewRecordPage() {
  const profile = await getProfile()
  return <RecordForm favoriteTeam={profile?.favorite_team} />
}
