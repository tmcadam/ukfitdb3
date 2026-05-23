import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders hello world heading', () => {
    render(<App />)
    const headingElement = screen.getByText(/Hello, Publications!/i)
    expect(headingElement).toBeInTheDocument()
  })

  it('renders welcome message', () => {
    render(<App />)
    const paragraphElement = screen.getByText(/Welcome to your Publications App boilerplate/i)
    expect(paragraphElement).toBeInTheDocument()
  })

  it('renders the App component with correct class', () => {
    render(<App />)
    const appContainer = document.querySelector('.App')
    expect(appContainer).toBeInTheDocument()
  })
})
