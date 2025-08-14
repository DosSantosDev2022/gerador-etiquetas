import {
  SquareTerminal,
} from "lucide-react"

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "CEDOC",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Gerador de etiquetas TJ",
          url: "/labelPage",
        },
      ],
    },
     {
      title: "EXPEDIÇÃO",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Flags Correios",
          url: "/labelPage",
        },
      ],
    },
  ],
}