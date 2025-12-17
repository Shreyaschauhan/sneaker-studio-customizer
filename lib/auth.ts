import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"

const USERS_KEY = "sneaker_users"
const TOKEN_KEY = "sneaker_token"

export function signup(email: string, password: string) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")

  if (users.find((u: any) => u.email === email)) {
    throw new Error("User already exists")
  }

  const hashed = bcrypt.hashSync(password, 10)

  users.push({
    id: uuidv4(),
    email,
    password: hashed,
  })

  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function login(email: string, password: string) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  const user = users.find((u: any) => u.email === email)

  if (!user) throw new Error("User not found")

  const match = bcrypt.compareSync(password, user.password)
  if (!match) throw new Error("Invalid credentials")

  const token = uuidv4()
  localStorage.setItem(TOKEN_KEY, token)
  return token
}
export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}


