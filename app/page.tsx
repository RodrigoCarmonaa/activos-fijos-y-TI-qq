import { auth } from "@/auth"
import { AppClient } from "./app-client"
import { getInitialAppState } from "@/app/actions/database"

export default async function Page() {
  const session = await auth()
  let dbState = null

  if (session?.user) {
    dbState = await getInitialAppState()
  }
  
  return <AppClient sessionUser={session?.user || null} initialDbState={dbState} />
}
