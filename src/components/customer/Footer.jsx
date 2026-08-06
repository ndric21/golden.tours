import { Compass, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-ink-950 text-ink-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-gradient text-ink-950">
                <Compass className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold text-gradient-gold">Golden Tours</span>
            </div>
            <p className="mt-3 text-sm text-ink-400">
              Premium, AI-guided journeys across Tanzania, Kenya, Uganda, Rwanda and Zanzibar.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Destinations</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-400">
              <li>Serengeti & Ngorongoro, Tanzania</li>
              <li>Masai Mara, Kenya</li>
              <li>Bwindi Gorilla Trekking, Uganda</li>
              <li>Volcanoes National Park, Rwanda</li>
              <li>Zanzibar Beaches & Stone Town</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Experiences</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-400">
              <li>Wildlife Safaris</li>
              <li>Kilimanjaro Climbs</li>
              <li>Gorilla Trekking</li>
              <li>Honeymoon Escapes</li>
              <li>Luxury Getaways</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Get in touch</h4>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold-400" /> hello@goldentours.africa
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold-400" /> +255 (0) 754 000 000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold-400" /> Arusha, Tanzania
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-ink-800 pt-6 text-xs text-ink-500">
          © {new Date().getFullYear()} Golden Tours. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
