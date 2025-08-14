import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// 1. Importe o seu componente da Sidebar
//    Ajuste o caminho se necessário.
import { AppSidebar } from '@/components/sidebar/app-sidebar' 
import { SidebarProvider } from '@/components/ui'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    // 2. Crie um container flexível que ocupe a tela inteira
    <div className="flex min-h-screen"> 
    <SidebarProvider>
{/* Sua Sidebar fica aqui, fixa à esquerda */}
      <AppSidebar />

      {/* 3. A área principal ocupará o espaço restante */}
      <main className="flex-1 p-8 bg-muted/40">
        
        {/* O <Outlet /> renderiza o conteúdo da página atual aqui dentro */}
        <Outlet />

      </main>

      {/* As ferramentas de desenvolvimento do TanStack Router */}
      <TanStackRouterDevtools position="bottom-right" />
    </SidebarProvider>
      
    </div>
  )
}