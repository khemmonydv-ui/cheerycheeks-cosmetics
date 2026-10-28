export async function getAccounts() {
  const res = await fetch('/products-data/accounts.json')
  if (!res.ok) throw new Error('Failed to load accounts')
  return await res.json()
}