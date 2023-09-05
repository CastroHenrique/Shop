import { HomeContainer, Product } from "@/styles/pages/home"
import { styled } from "../styles"
import { useKeenSlider } from 'keen-slider/react'
import Image from "next/image"
import camiseta1 from '../assets/Camisetas/1.png'
import camiseta2 from '../assets/Camisetas/2.png'
import camiseta3 from '../assets/Camisetas/3.png'
import camiseta4 from '../assets/Camisetas/4.png'
import 'keen-slider/keen-slider.min.css';
import { stripe } from "@/lib/stripe"
import { GetServerSideProps } from "next"
import Stripe from "stripe"


interface HomeProps {
    products: {
        id: string;
        name: string;
        imageUrl: string;
        price: number;
    }[]
}
export default function Home({ products }: HomeProps) {

    const [sliderRef] = useKeenSlider({
        slides: {
            perView: 3,
            spacing: 48,
        }
    })

    return (
        <HomeContainer ref={sliderRef} className="keen-slider">
            {products.map(products => {
                return (
                    <Product key={products.id} className="keen-slider__slide">
                        <Image src={products.imageUrl} alt={""} width={520} height={480} />
                        <footer>
                            <strong>{products.name}</strong>
                            <span> {products.price}</span>
                        </footer>
                    </Product>
                )
            })}
        </HomeContainer>
    )
}
/* server side in node {
    quando precisamos fazer uma chamada na API sem que o usuário precise saber
}
*/
export const getServerSideProps: GetServerSideProps = async () => {
    const response = await stripe.products.list({
        expand: ['data.default_price']
    })

    const products = response.data.map(product => {

        const price = product.default_price as Stripe.Price

        return {
            id: product.id,
            name: product.name,
            imageUrl: product.images[0],
            price: price.unit_amount,
        }
    })

    return {
        props: {
            products,
        }
    }
}