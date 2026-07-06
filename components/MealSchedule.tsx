'use client'
import Image from 'next/image'

type Slot = 'morning' | 'evening' | 'night'

type Product = {
  name:     string
  qty:      string
  category: string
  img:      string
  days:     string[]
}

type SlotData = { label: string; icon: string; time: string; items: Product[] }
type Schedule = { [slot in Slot]: SlotData }

const SCHEDULE: Schedule = {
  morning: {
    label: 'Morning', icon: '☀️', time: '7 – 9 AM',
    items: [
      { name: 'Boiled Eggs',   qty: '2 pcs',  category: 'Egg Products', days: ['Mon','Wed','Fri'], img: 'https://images.unsplash.com/photo-1546069901-5ec6a79120b0?w=300&q=80' },
      { name: 'Honey',         qty: '1 tbsp', category: 'Sweeteners',   days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&q=80' },
      { name: 'Oats Porridge', qty: '1 bowl', category: 'Foodstuff',    days: ['Tue','Thu','Sat'], img: 'https://images.unsplash.com/photo-1702648982253-8b851013e81f?w=300&q=80' },
    ],
  },
  evening: {
    label: 'Evening', icon: '🌤️', time: '1 – 3 PM',
    items: [
      { name: 'Egg Bhurji',  qty: '1 serving', category: 'Egg Products', days: ['Tue','Thu','Sat'], img: 'https://images.unsplash.com/photo-1687630433865-f86f07be989a?w=300&q=80' },
      { name: 'Date Syrup',  qty: '1 tbsp',    category: 'Sweeteners',   days: ['Mon','Wed','Fri','Sun'], img: 'https://images.unsplash.com/photo-1629738601425-494c3d6ba3e2?w=300&q=80' },
      { name: 'Brown Rice',  qty: '½ cup',     category: 'Foodstuff',    days: ['Mon','Tue','Wed','Thu','Fri'], img: 'https://images.unsplash.com/photo-1502472231352-10142bacaba2?w=300&q=80' },
    ],
  },
  night: {
    label: 'Night', icon: '🌙', time: '7 – 9 PM',
    items: [
      { name: 'Egg Soup',     qty: '1 bowl',  category: 'Egg Products', days: ['Mon','Wed','Fri','Sun'], img: 'https://images.unsplash.com/photo-1555232967-ccd0e323e3e0?w=300&q=80' },
      { name: 'Stevia Drops', qty: '2 drops', category: 'Sweeteners',   days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], img: 'https://images.unsplash.com/photo-1433171755048-c7da8b9ebb2b?w=300&q=80' },
      { name: 'Paneer Curry', qty: '1 bowl',  category: 'Foodstuff',    days: ['Tue','Thu','Sat','Sun'], img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&q=80' },
    ],
  },
}

const CAT_STYLE: Record<string, { color: string; border: string; dot: string }> = {
  'Egg Products': { color: '#fff8ec', border: '#f5dfa0', dot: '🥚' },
  'Sweeteners':   { color: '#fef3f0', border: '#f5c4b8', dot: '🍯' },
  'Foodstuff':    { color: '#f3f9ef', border: '#b8d9a8', dot: '🌾' },
}

const ALL_DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function MealSchedule() {
  return (
    <section className="bg-[var(--cream2)] py-20 px-5 md:px-[52px]">

      {/* Heading */}
      <div className="rv text-center max-w-[600px] mx-auto mb-10">
        <div className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-[var(--green)] flex items-center justify-center gap-2.5 mb-3.5
          before:content-[''] before:w-7 before:h-[1.5px] before:bg-[var(--green)] before:flex-shrink-0
          after:content-[''] after:w-7 after:h-[1.5px] after:bg-[var(--green)] after:flex-shrink-0">
          Weekly Meal Schedule
        </div>
        <h2 className="font-playfair text-[clamp(1.8rem,3vw,2.8rem)] font-bold leading-[1.12] text-[var(--green)] tracking-[-0.02em]">
          Your Daily <em className="not-italic text-[var(--terracotta)]">Nutrition Plan</em>
        </h2>
      </div>

      {/* Slot rows */}
      <div className="rv max-w-[1100px] mx-auto space-y-5">
        {(['morning', 'evening', 'night'] as Slot[]).map(slotKey => {
          const slot = SCHEDULE[slotKey]
          return (
            <div key={slotKey} className="bg-white rounded-[20px] border border-[var(--border)] shadow-[0_4px_24px_var(--shadow)] overflow-hidden">

              {/* Slot header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)] bg-[var(--cream)]">
                <span className="text-[1.4rem]">{slot.icon}</span>
                <span className="font-playfair font-bold text-[1rem] text-[var(--green)]">{slot.label}</span>
                <span className="text-[0.68rem] text-[var(--text-muted)] tracking-[0.05em]">{slot.time}</span>
              </div>

              {/* 3 product cards */}
              <div className="grid grid-cols-3 divide-x divide-[var(--border)]">
                {slot.items.map((item) => {
                  const style = CAT_STYLE[item.category]
                  return (
                    <div key={item.name} className="flex flex-col items-center py-6 px-4 gap-3">
                      {/* Image */}
                      <div
                        className="relative w-full aspect-square max-w-[160px] rounded-2xl overflow-hidden border"
                        style={{ background: style.color, borderColor: style.border }}>
                        <Image src={item.img} alt={item.name} fill className="object-cover" sizes="160px" />
                      </div>

                      {/* Info */}
                      <div className="text-center w-full">
                        <span
                          className="inline-flex items-center gap-1 text-[0.6rem] font-bold tracking-[0.08em] uppercase px-2.5 py-0.5 rounded-full border mb-1.5"
                          style={{ background: style.color, borderColor: style.border, color: 'var(--green-mid)' }}>
                          {style.dot} {item.category}
                        </span>
                        <div className="font-playfair font-semibold text-[0.95rem] text-[var(--green)] leading-tight">{item.name}</div>
                        <div className="text-[0.72rem] text-[var(--text-muted)] mt-0.5 mb-3">{item.qty}</div>

                        {/* Day pills */}
                        <div className="flex flex-wrap justify-center gap-1">
                          {ALL_DAYS.map(d => {
                            const active = item.days.includes(d)
                            return (
                              <span
                                key={d}
                                className="text-[0.58rem] font-semibold px-1.5 py-0.5 rounded-md"
                                style={active
                                  ? { background: 'var(--green)', color: 'var(--cream)' }
                                  : { background: 'var(--cream2)', color: 'var(--text-muted)', opacity: 0.5 }}>
                                {d}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>
          )
        })}
      </div>
    </section>
  )
}
