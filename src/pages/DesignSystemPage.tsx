import { MapPin } from 'lucide-react';
import { Page } from '@/components/ui/Page';
import { PageHeader } from '@/components/ui/PageHeader';
import { Section } from '@/components/ui/Section';
import { Row } from '@/components/ui/Row';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { InlineError } from '@/components/ui/InlineError';
import { Timeline, TimelineItem } from '@/components/ui/Timeline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const TOKENS = [
  { name: 'ink', swatchClass: 'bg-ink', label: '#111827' },
  { name: 'body', swatchClass: 'bg-body', label: '#374151' },
  { name: 'line', swatchClass: 'bg-line', label: '#e5e7eb' },
  { name: 'primary', swatchClass: 'bg-traveler-primary', label: '#0f4c81' },
  { name: 'accent', swatchClass: 'bg-traveler-accent', label: '#f97316' },
  { name: 'paper', swatchClass: 'bg-paper', label: '#fafaf8' },
];

export default function DesignSystemPage() {
  return (
    <Page constrained>
      <PageHeader
        title='Design System'
        subtitle='Traveler UI primitives — fejlesztői referencia'
      />
      <div className='space-y-10'>
        <Section title='Tokenek' eyebrow='Colors'>
          <div className='flex flex-wrap gap-4'>
            {TOKENS.map((t) => (
              <div key={t.name} className='flex flex-col items-center gap-1.5'>
                <div
                  className={`w-12 h-12 rounded-lg border border-border shadow-card ${t.swatchClass}`}
                />
                <span className='text-[10px] font-mono text-muted-foreground'>
                  {t.name}
                </span>
                <span className='text-[10px] font-mono text-muted-foreground/60'>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title='Tipográfia' eyebrow='Typography'>
          <div className='space-y-2'>
            <p className='text-2xl font-bold text-foreground'>2xl bold — Cím</p>
            <p className='text-xl font-semibold text-foreground'>xl semibold — Alcím</p>
            <p className='text-lg font-medium text-foreground'>
              lg medium — Szekciófelirat
            </p>
            <p className='text-base text-foreground'>base — Törzsszöveg</p>
            <p className='text-sm text-muted-foreground'>sm muted — Leírás</p>
            <p className='text-xs text-muted-foreground uppercase tracking-wide font-medium'>
              xs eyebrow — Szemöldök
            </p>
          </div>
        </Section>

        <Section title='Gombok' eyebrow='Button'>
          <div className='flex flex-wrap gap-2'>
            <Button>Default</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='destructive'>Destructive</Button>
            <Button size='sm'>Small</Button>
            <Button size='sm' variant='outline'>
              Small outline
            </Button>
          </div>
        </Section>

        <Section title='Badge-ek' eyebrow='Badge'>
          <div className='flex flex-wrap gap-2'>
            <Badge>Default</Badge>
            <Badge variant='outline'>Outline</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='destructive'>Destructive</Badge>
          </div>
        </Section>

        <Section title='Kártya' eyebrow='Card'>
          <Card>
            <CardContent className='p-4'>
              <p className='text-sm text-muted-foreground'>Kártya tartalma.</p>
            </CardContent>
          </Card>
        </Section>

        <Section title='Sorok' eyebrow='Row'>
          <div className='divide-y divide-border rounded-lg overflow-hidden border border-border'>
            <Row
              icon={<MapPin className='size-4' />}
              title='Ikon és alcím'
              subtitle='Másodlagos szöveg'
            />
            <Row title='Kattintható sor' subtitle='Nyíllal' onClick={() => {}} />
            <Row title='Link sor' href='#' />
          </div>
        </Section>

        <Section title='Állapotok' eyebrow='States'>
          <div className='space-y-4'>
            <LoadingState label='Betöltés példa...' />
            <EmptyState
              title='Nincs találat'
              description='Próbálj más keresési feltételt.'
            />
            <InlineError message='Valami hiba történt.' onRetry={() => {}} />
          </div>
        </Section>

        <Section title='Idővonal' eyebrow='Timeline'>
          <Timeline>
            <TimelineItem
              time='09:00'
              title='Reggeli'
              description='Hotel étterem, svédasztal'
              badges={['INGYENES']}
            />
            <TimelineItem
              time='10:30'
              title='Városnézés'
              description='Belváros gyalogos körút'
              highlight
            />
            <TimelineItem time='13:00' title='Ebéd' badges={['GYEREKBARÁT']} />
            <TimelineItem time='15:00' title='Múzeum' description='Opcionális program' />
          </Timeline>
        </Section>
      </div>
    </Page>
  );
}
