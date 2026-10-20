import Link from "next/link";
import Image from "next/image";
import StayCard from "@/components/StayCard";
import { listStays } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function HomePage() {
  const stays = listStays();
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Narok Town, Kenya</span>
            <h1>Find your perfect stay near the wild heart of Kenya.</h1>
            <p>Discover welcoming homes, boutique lodges, and memorable stays for safari lovers, families, and business travelers.</p>
            <form action="/stays" className="search-card">
              <label className="field"><span>Location</span><input name="location" defaultValue="Narok Town" /></label>
              <label className="field"><span>Check in</span><input type="date" name="checkin" /></label>
              <label className="field"><span>Check out</span><input type="date" name="checkout" /></label>
              <label className="field"><span>Guests</span><select name="guests" defaultValue="2"><option value="1">1 guest</option><option value="2">2 guests</option><option value="4">4 guests</option><option value="6">6 guests</option><option value="8">8 guests</option></select></label>
              <button className="btn btn-primary wide" type="submit">Search stays</button>
            </form>
            <div className="stats-row">
              <div><strong>Local</strong><span>hosted stays</span></div>
              <div><strong>4.9/5</strong><span>guest rating</span></div>
              <div><strong>Narok</strong><span>your next stop</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="image-stack">
              <Image
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85"
                alt="Warm, light-filled home interior"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="floating-card">
                <span className="tag">Guest favorite</span>
                <h3>Maasai Sunset Lodge</h3>
                <div className="rating-line"><span>★ 4.9</span><strong>KSh 8,500/night</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured container" id="stays">
        <div className="section-head">
          <div><span className="eyebrow">Recommended</span><h2>Popular places to stay</h2></div>
          <Link className="text-link" href="/stays">Browse all stays</Link>
        </div>
        <div className="card-grid">{stays.map((stay) => <StayCard key={stay.slug} stay={stay} />)}</div>
      </section>

      <section className="experience container" id="experiences">
        <div className="section-head"><div><span className="eyebrow">Explore</span><h2>Experience Narok</h2></div></div>
        <div className="experience-grid">
          <article className="experience-item"><Image src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=900&q=80" alt="African landscape at sunset" width={900} height={600} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /><div><h3>Culture &amp; community</h3><p>Find local guides and learn about the people and traditions of the region.</p></div></article>
          <article className="experience-item"><Image src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=900&q=80" alt="Wildlife in the savannah" width={900} height={600} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /><div><h3>Safari day trips</h3><p>Plan a day exploring wildlife and landscapes with a trusted local operator.</p></div></article>
          <article className="experience-item"><Image src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80" alt="A colorful local market" width={900} height={600} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /><div><h3>Local markets</h3><p>Discover local crafts, fresh produce, and authentic Kenyan souvenirs.</p></div></article>
        </div>
      </section>

      <section className="benefits container">
        <div className="section-head compact"><div><span className="eyebrow">Why NarokNest</span><h2>A smoother stay, from start to finish</h2></div></div>
        <div className="benefits-grid">
          <article className="benefit-card"><div className="icon-badge">✓</div><h3>Thoughtful stays</h3><p>Compare useful amenities, guest capacity, and clear nightly prices.</p></article>
          <article className="benefit-card"><div className="icon-badge">⌂</div><h3>Local character</h3><p>Find a comfortable base and get to know Narok at your own pace.</p></article>
          <article className="benefit-card"><div className="icon-badge">↗</div><h3>Simple planning</h3><p>Choose your dates and see an estimated total before you request a booking.</p></article>
          <article className="benefit-card"><div className="icon-badge">♡</div><h3>Save favorites</h3><p>Create an account to keep your travel planning close at hand.</p></article>
        </div>
      </section>

      <section className="neighborhoods container" id="host">
        <div className="section-head compact"><div><span className="eyebrow">Neighborhoods</span><h2>Find your kind of Narok</h2></div></div>
        <div className="neighborhood-grid">
          <article className="neighborhood-card highlight"><span className="neighborhood-tag">Lively</span><h3>Central Narok</h3><p>Stay close to restaurants, shops, and everyday town conveniences.</p><strong>A convenient town base</strong></article>
          <article className="neighborhood-card"><span className="neighborhood-tag">Peaceful</span><h3>Maasai Plains</h3><p>Look for quieter stays with room to relax after a day out exploring.</p><strong>Space to unwind</strong></article>
          <article className="neighborhood-card"><span className="neighborhood-tag">Connected</span><h3>Township Loop</h3><p>A practical option for business trips and easy road access.</p><strong>Handy for short visits</strong></article>
        </div>
      </section>

      <section className="reviews container" id="reviews">
        <div className="section-head"><div><span className="eyebrow">Guest stories</span><h2>Stay a little closer to Narok</h2></div></div>
        <div className="review-grid">
          <article className="review-card"><div className="stars">★★★★★</div><p>“A welcoming place to return to after a long day exploring. The host made everything easy.”</p><div className="reviewer"><strong>Mary W.</strong><span>Nairobi</span></div></article>
          <article className="review-card"><div className="stars">★★★★★</div><p>“Comfortable, clean, and a great base for our family trip through the region.”</p><div className="reviewer"><strong>John K.</strong><span>Mombasa</span></div></article>
          <article className="review-card"><div className="stars">★★★★★</div><p>“Thoughtful hospitality and a lovely stay. We would happily book again.”</p><div className="reviewer"><strong>Aisha M.</strong><span>Kisumu</span></div></article>
        </div>
      </section>
    </main>
  );
}
