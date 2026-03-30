export const isAuthenticated = () => {
  const token = localStorage.getItem("token")
  const hasPassword = localStorage.getItem("hasPassword")

  if (!token) return false
  if (!hasPassword || hasPassword === "false") return false

  return true
}