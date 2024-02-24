import { Check } from 'lucide-react'
import Link from 'next/link'

import { pricingCards } from '@/lib/constants'
import { cn } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const PricingCards = () => {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-4">
      {pricingCards.map((card) => (
        <Card
          key={card.title}
          className={cn(
            'flex w-[300px] flex-col justify-between',
            card.title === 'Unlimited Saas' && 'border-2 border-primary',
          )}
        >
          <CardHeader>
            <CardTitle className={cn(card.title !== 'Unlimited Saas' && 'text-muted-foreground')}>
              {card.title}
            </CardTitle>

            <CardDescription>{card.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <span className="text-4xl font-bold">{card.price}</span>
            <span className="text-muted-foreground">/m</span>
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-4">
            <>
              {card.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="text-muted-foreground" />
                  <p>{feature}</p>
                </div>
              ))}
            </>

            <Link
              href={`/agency?plan=${card.priceId}`}
              className={cn(
                'w-full rounded-md bg-primary p-2 text-center',
                card.title === 'Unlimited Saas' && '!bg-muted-foreground',
              )}
            >
              Get Started
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
