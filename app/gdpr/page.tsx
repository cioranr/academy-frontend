import type { ReactNode } from 'react'

const p: React.CSSProperties = {
  fontWeight: 300,
  fontSize: '15px',
  color: '#414042',
  lineHeight: 1.8,
  margin: 0,
  fontFamily: '"Roboto", sans-serif',
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: '36px' }}>
      <h2 style={{ fontWeight: 400, fontSize: '17px', color: '#065EA6', marginBottom: '14px', paddingBottom: '6px', borderBottom: '1px solid #d0e8f0', fontFamily: '"Roboto", sans-serif' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
      </div>
    </section>
  )
}

export default function GDPRPage() {
  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', fontFamily: '"Roboto", sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>

        <h1 style={{ fontWeight: 300, fontSize: '32px', color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: '"Roboto", sans-serif' }}>
          Regulament GDPR
        </h1>
        <p style={{ ...p, marginBottom: '40px', fontSize: '13px', color: '#9ca3af' }}>Informații privind drepturile dumneavoastră conform Regulamentului (UE) 2016/679</p>

        <Section title="Ce este GDPR?">
          <p style={p}>Regulamentul General privind Protecția Datelor (GDPR) — Regulamentul (UE) 2016/679 — este legislația europeană care stabilește regulile cu privire la colectarea, stocarea și prelucrarea datelor cu caracter personal ale persoanelor fizice din Uniunea Europeană.</p>
          <p style={p}>MONZA CARDIO SRL, în calitate de operator, se angajează să respecte și să protejeze datele dumneavoastră cu caracter personal în conformitate cu prevederile acestui regulament.</p>
        </Section>

        <Section title="Ce date colectăm?">
          <p style={p}>Colectăm doar datele necesare pentru scopurile declarate, inclusiv:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Date de identificare: nume, prenume, cod numeric personal (CNP)',
              'Date de contact: adresă de e-mail, număr de telefon, adresă poștală',
              'Date profesionale: specialitate medicală, grad profesional, angajator',
              'Date tehnice: adresă IP, cookies, identificatori online',
              'Date medicale (acolo unde este necesar pentru furnizarea serviciilor)',
            ].map((item, i) => (
              <li key={i} style={p}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="De ce colectăm datele?">
          <p style={p}>Datele dumneavoastră sunt prelucrate în următoarele scopuri:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Gestionarea înscrierii la workshopuri și evenimente educaționale',
              'Furnizarea serviciilor medicale și educaționale solicitate',
              'Comunicări legate de evenimentele la care v-ați înscris',
              'Emiterea de certificate și diplome de participare',
              'Respectarea obligațiilor legale ale MONZA CARDIO SRL',
              'Îmbunătățirea serviciilor și a experienței pe platformă',
              'Marketing (exclusiv pe baza consimțământului dumneavoastră)',
            ].map((item, i) => (
              <li key={i} style={p}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="Temeiul juridic al prelucrării">
          <p style={p}>Prelucrăm datele dumneavoastră în baza unuia sau mai multora dintre următoarele temeiuri juridice:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'Executarea unui contract sau pentru a face demersuri la cererea dumneavoastră înainte de încheierea unui contract',
              'Consimțământul dumneavoastră explicit (ex: marketing, newsletter)',
              'Obligații legale ale MONZA CARDIO SRL',
              'Interese legitime ale operatorului, atunci când acestea nu prejudiciază drepturile dumneavoastră',
            ].map((item, i) => (
              <li key={i} style={p}>{item}</li>
            ))}
          </ul>
        </Section>

        <Section title="Drepturile dumneavoastră conform GDPR">
          <p style={p}>Conform GDPR, beneficiați de următoarele drepturi pe care le puteți exercita oricând:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { title: 'Dreptul de acces', desc: 'Puteți solicita o copie a datelor pe care le deținem despre dumneavoastră.' },
              { title: 'Dreptul la rectificare', desc: 'Puteți solicita corectarea datelor inexacte sau incomplete.' },
              { title: 'Dreptul la ștergere („dreptul de a fi uitat")', desc: 'Puteți solicita ștergerea datelor dumneavoastră, în condițiile prevăzute de lege.' },
              { title: 'Dreptul la restricționarea prelucrării', desc: 'Puteți solicita limitarea modului în care vă prelucrăm datele.' },
              { title: 'Dreptul la portabilitatea datelor', desc: 'Puteți solicita transferul datelor dumneavoastră către un alt operator, într-un format structurat.' },
              { title: 'Dreptul de a obiecta', desc: 'Puteți obiecta la prelucrarea datelor dumneavoastră, în special pentru scopuri de marketing direct.' },
              { title: 'Dreptul de a retrage consimțământul', desc: 'Puteți retrage oricând consimțământul acordat, fără a afecta legalitatea prelucrărilor anterioare.' },
              { title: 'Dreptul de a depune o plângere', desc: 'Puteți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP) — www.dataprotection.ro.' },
            ].map((item, i) => (
              <li key={i} style={p}><strong style={{ fontWeight: 500 }}>{item.title}:</strong> {item.desc}</li>
            ))}
          </ul>
        </Section>

        <Section title="Cât timp păstrăm datele?">
          <p style={p}>Datele dumneavoastră sunt păstrate pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate, respectând totodată obligațiile legale de arhivare și termenele de prescripție aplicabile. La expirarea perioadei de stocare, datele sunt șterse sau anonimizate.</p>
        </Section>

        <Section title="Securitatea datelor">
          <p style={p}>MONZA CARDIO SRL implementează măsuri tehnice și organizatorice adecvate pentru protejarea datelor dumneavoastră împotriva accesului neautorizat, modificării, divulgării sau distrugerii. Accesul la datele cu caracter personal este restricționat exclusiv la personalul autorizat.</p>
        </Section>

        <Section title="Cum vă puteți exercita drepturile?">
          <p style={p}>Pentru orice solicitare legată de datele dumneavoastră cu caracter personal, ne puteți contacta prin:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '12px', borderLeft: '3px solid #065EA6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ ...p, fontWeight: 500, color: '#065EA6' }}>MONZA CARDIO SRL</p>
              <p style={p}>Adresă: STR. TONY BULANDRA NR. 27, SECTOR 2, BUCUREȘTI, COD POȘTAL 021967</p>
              <p style={p}>Telefon: <a href="tel:0319300" style={{ color: '#065EA6' }}>031 9300</a> (08:00 – 20:00)</p>
              <p style={p}>Email: <a href="mailto:marketing@monza-ares.ro" style={{ color: '#065EA6' }}>marketing@monza-ares.ro</a></p>
            </div>
            <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '12px', borderLeft: '3px solid #065EA6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <p style={{ ...p, fontWeight: 500, color: '#065EA6' }}>Responsabil cu protecția datelor (DPO)</p>
              <p style={p}>Radu Taracila Padurari Retevoescu SCA (RTPR)</p>
              <p style={p}>Adresă: Piața Charles de Gaulle nr. 15, etaj 5, sector 1, București, cod poștal 011857</p>
              <p style={p}>Email: <a href="mailto:dpoares@rtpr.ro" style={{ color: '#065EA6' }}>dpoares@rtpr.ro</a></p>
            </div>
          </div>
          <p style={p}>Vom răspunde solicitării dumneavoastră în termen de maximum 30 de zile calendaristice de la primirea acesteia.</p>
        </Section>

        <Section title="Modificări ale acestui regulament">
          <p style={p}>Ne rezervăm dreptul de a actualiza periodic acest document pentru a reflecta modificările legislative sau operaționale. Versiunea actualizată va fi publicată pe site cu cel puțin 20 de zile înainte de intrarea sa în vigoare.</p>
        </Section>

      </div>
    </main>
  )
}
