import ThemeCard from "./ThemeCard"

interface ThemeCard {
    name:string
}

const themeCards:ThemeCard[] = [
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
    {
        name:"demo theme",
    },
]

export const ThemeCardList = () => {
  return (
    <>
    {
        themeCards.map((card,index)=>(
            <ThemeCard key={index}/>
        ))
    }
    </>
  )
}
