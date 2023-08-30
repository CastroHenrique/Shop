import { HomeContainer, Product } from "@/styles/pages/home"
import { styled } from "../styles"
import Image from "next/image"
import camiseta1 from '../assets/Camisetas/1.png'
import camiseta2 from '../assets/Camisetas/2.png'
import camiseta3 from '../assets/Camisetas/3.png'
import camiseta4 from '../assets/Camisetas/4.png'



export default function Home() {
    return (
        <HomeContainer>
            <Product>
                <Image src={camiseta1} alt={""} width={520} height={480} />
                <footer>
                    <strong>Camiseta x</strong>
                    <span> R$ 79,90</span>
                </footer>
            </Product>
            <Product>
                <Image src={camiseta2} alt={""} width={520} height={480} />
                <footer>
                    <strong>Camiseta x</strong>
                    <span> R$ 79,90</span>
                </footer>
            </Product>
        </HomeContainer>
    )
}