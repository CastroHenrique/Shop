import { stripe } from "@/lib/stripe";
import { ImageContainer, ProductContainer, ProductDetails } from "@/styles/pages/product";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import Stripe from "stripe";

interface ProductProps {
    product: {
        id: string;
        name: string;
        imageUrl: string;
        price: string;
        descriptions: string;
        defoutPriceId: string;
    }
}

export default function Product({ product }: ProductProps) {
    const [isCreatingChechoutSession, setIsCreatingChechoutSession] = useState(false)

    async function handleBuyProduct() {
        try {
            setIsCreatingChechoutSession(true)
            const response = await axios.post('/api/checkout', {
                priceId: product.defoutPriceId
            })
            const { checkoutUrl } = response.data;

            window.location.href = checkoutUrl;

        } catch (err) {
            setIsCreatingChechoutSession(false)

            // Conectar com uma ferramenta de observabilidade (Datadog / Sentry)
            alert('Falha ao redirecionar ao checkout!')
        }
    }

    return (
        <>
            <Head>
                <title>{product.name} | Ignite Shop</title>
            </Head>
            <ProductContainer>
                <ImageContainer>
                    <Image src={product.imageUrl} alt={""} width={520} height={480} />
                </ImageContainer>
                <ProductDetails>
                    <h1>{product.name}</h1>
                    <span>{product.price}</span>
                    <p>{product.descriptions}</p>

                    <button disabled={isCreatingChechoutSession} onClick={handleBuyProduct}>
                        Comprar agora
                    </button>
                </ProductDetails>
            </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            { params: { id: 'prod_OXvBs0UmoUWXAz' } }
        ],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({ params }) => {

    const productId = params!.id;

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price']
    });
    const price = product.default_price as Stripe.Price

    return {
        props: {
            product: {
                id: product.id,
                name: product.name,
                imageUrl: product.images[0],
                price: new Intl.NumberFormat('pt-Br', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(price.unit_amount! / 100),
                descriptions: product.description,
                defoutPriceId: price.id,
            }
        },
        revalidate: 60 * 60 * 1,
    }
}