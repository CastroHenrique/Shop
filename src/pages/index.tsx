import { HomeContainer, Product } from "@/styles/pages/home"
import Head from "next/head";
import { useKeenSlider } from 'keen-slider/react'
import Image from "next/image"
import 'keen-slider/keen-slider.min.css';
import { stripe } from "@/lib/stripe"
import { GetStaticProps } from "next"
import Link from "next/link";
import Stripe from "stripe"


interface HomeProps {
    products: {
        id: string;
        name: string;
        imageUrl: string;
        price: string;
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
        <>
            <Head>
                <title>Home | Ignite Shop</title>
            </Head>
            <HomeContainer ref={sliderRef} className="keen-slider">
                {products.map(products => {
                    return (
                        <Link href={`/product/${products.id}`} prefetch={false}
                            key={products.id}>
                            <Product className="keen-slider__slide">
                                <Image src={products.imageUrl} alt={""} width={520} height={480} />
                                <footer>
                                    <strong>{products.name}</strong>
                                    <span> {products.price}</span>
                                </footer>
                            </Product>
                        </Link>
                    )
                })}
            </HomeContainer>
        </>
    )
}
/* server side in node {
    quando precisamos fazer uma chamada na API sem que o usuário precise saber
}
*/
export const getStaticProps: GetStaticProps = async ({ }) => {
    const response = await stripe.products.list({
        expand: ['data.default_price']
    })

    const products = response.data.map(product => {

        const price = product.default_price as Stripe.Price

        return {
            id: product.id,
            name: product.name,
            imageUrl: product.images[0],
            price: new Intl.NumberFormat('pt-Br', {
                style: 'currency',
                currency: 'BRL'
            }).format(price.unit_amount! / 100),
        }
    })

    return {
        props: {
            products,
        },
        revalidate: 60 * 60 * 2, //  para atualizar....
    }
}