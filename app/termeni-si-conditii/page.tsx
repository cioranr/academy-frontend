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

export default function TermeniConditiiPage() {
  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', fontFamily: '"Roboto", sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>

        <h1 style={{ fontWeight: 300, fontSize: '32px', color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: '"Roboto", sans-serif' }}>
          Termeni și condiții
        </h1>
        <p style={{ ...p, marginBottom: '40px', fontSize: '13px', color: '#9ca3af' }}>pentru accesare website</p>

        <Section title="Introducere">
          <p style={p}>Bine ați venit pe platforma <strong>https://monza-ares-academy.ro</strong>, operată de MONZA CARDIO SRL. Accesarea și utilizarea serviciilor furnizate implică acceptarea termenilor și condițiilor prezentate mai jos. Acești termeni pot fi actualizați periodic, iar cea mai recentă versiune va fi disponibilă pe website.</p>
          <p style={p}>Site-ul web www.monza-ares-academy.ro este proprietatea firmei <strong>MONZA CARDIO SRL</strong>, cu sediul în București, str. Tony Bulandra 27, parter, sector 2, CUI 48579781, J2023014308401, email: <a href="mailto:marketing@monza-ares.ro" style={{ color: '#065EA6' }}>marketing@monza-ares.ro</a></p>
        </Section>

        <Section title="Acceptarea Termenilor și Condițiilor">
          <p style={p}>Prin accesarea acestui site web și/sau a oricărei pagini a acestuia, sunteți de acord cu aceste condiții de utilizare. Dacă nu sunteți de acord cu acești termeni și condiții de utilizare, nu accesați acest site.</p>
        </Section>

        <Section title="Proprietate intelectuală">
          <p style={p}>Întregul conținut al site-ului www.monza-ares-academy.ro este protejat de legislația privind drepturile de autor, toate drepturile fiind rezervate. MONZA CARDIO SRL deține toate drepturile asupra paginilor, conținutului și prezentării site-ului.</p>
          <p style={p}>Orice copiere, modificare, afișare, distribuire, transmitere, publicare, comercializare, licențiere, creare de materiale derivate sau utilizare a conținutului în orice scop este strict interzisă fără acordul scris al MONZA CARDIO SRL.</p>
          <p style={p}>Toate informațiile, produsele și aplicațiile disponibile pe acest site sunt proprietatea MONZA CARDIO SRL, care își rezervă dreptul de a modifica conținutul și structura site-ului în orice moment, fără o notificare prealabilă.</p>
        </Section>

        <Section title="Limitarea răspunderii">
          <p style={p}>Acest site are scopul de a facilita accesul la workshopuri și evenimente derulate de Grupul Monza Ares și de a oferi informații privind serviciile oferite și condițiile de utilizare ale acestora.</p>
          <p style={p}>Utilizatorii sunt de acord să exonereze de răspundere MONZA CARDIO SRL pentru orice acțiune judiciară sau extrajudiciară rezultată din utilizarea incorectă sau frauduloasă a site-ului.</p>
          <p style={p}>În caz de forță majoră, MONZA CARDIO SRL și reprezentanții săi sunt exonerați total de orice responsabilitate. Cazurile de forță majoră includ, dar nu se limitează la: defecte tehnice ale echipamentelor, probleme de conexiune la internet sau telefonie, atacuri informatice, acces neautorizat la sistemele site-ului, erori de operare etc.</p>
          <p style={p}>MONZA CARDIO SRL își rezervă dreptul de a elimina oricând orice conexiune sau program afiliat, fără obligația de a asigura acces neîntrerupt la site. Link-urile către alte site-uri sunt furnizate doar pentru accesibilitate și nu implică asumarea răspunderii pentru conținutul acestora.</p>
        </Section>

        <Section title="Crearea contului și abonarea">
          <p style={p}>Pentru înscrierea la workshopuri sau alte evenimente ale Grupului Monza Ares și pentru acces la conținut educațional, se va crea un cont pe site-ul www.monza-ares-academy.ro. Obligația de a furniza date corecte pentru crearea contului cade în sarcina utilizatorului.</p>
          <p style={p}>Utilizatorii site-ului pot opta pentru primirea de newsletter, alerte, prin e-mail sau SMS. În orice moment, aceștia se pot dezabona simplu, accesând link-ul de dezabonare inclus în fiecare newsletter/alertă.</p>
        </Section>

        <Section title="Procedura de înscriere">
          <p style={p}>Înscrierea la workshopuri/evenimente se realizează prin crearea unui cont pe platformă și completarea formularului de înscriere aferent. Utilizatorul are obligația de a furniza informații reale și complete.</p>
          <p style={p}>Prin accesarea listei workshopurilor/evenimentelor disponibile, se selectează workshopul/evenimentul dorit și se verifică: data și ora, locația / formatul (online sau fizic), prețul (dacă există), condițiile de participare.</p>
          <p style={p}><strong>Confirmarea locului:</strong> Înscrierea este considerată validă (loc rezervat) doar după confirmarea prin email/mesaj scris și, după caz, după efectuarea plății. Neconfirmarea prezenței la workshop/eveniment atrage după sine anularea rezervării.</p>
          <p style={p}>Workshopurile sau alte evenimente ale Grupului Monza Ares dispun de un număr limitat de participanți. Înscrierile sunt procesate în ordinea înregistrării, în limita locurilor disponibile.</p>
          <p style={p}>Organizatorul își rezervă dreptul de a refuza sau anula înscrieri în cazul furnizării de informații incorecte sau neîndeplinirii condițiilor de participare. În cazul anulării evenimentului din orice motive, participanții vor fi înștiințați de îndată, prin intermediul datelor de contact furnizate.</p>
        </Section>

        <Section title="Declarație medicală / responsabilitate">
          <p style={p}>Workshopurile nu reprezintă consultații medicale. Informațiile sunt educaționale. Participarea se face pe propria răspundere. Informațiile prezentate în cadrul workshopurilor au scop educațional și nu înlocuiesc consultul medical de specialitate.</p>
        </Section>

        <Section title="Protecția datelor cu caracter personal">
          <p style={p}>Prin completarea formularului de contact, vă exprimați în mod expres și neechivoc acordul ca datele dumneavoastră cu caracter personal să fie stocate și prelucrate de către MONZA CARDIO SRL și de alte companii ce fac parte din Grupul Monza Ares.</p>
          <p style={p}>Detalierea modului în care datele cu caracter personal sunt prelucrate se realizează în documentul denumit <a href="/politica-confidentialitate" style={{ color: '#065EA6' }}>Politica de confidențialitate</a>, disponibil pe site-ul www.monza-ares-academy.ro.</p>
          <p style={p}>Detalierea modului în care folosim cookie-uri se realizează în documentul denumit <a href="/politica-cookies" style={{ color: '#065EA6' }}>Politica privind cookies</a>, disponibil pe site-ul www.monza-ares-academy.ro.</p>
          <p style={p}>Pentru un plus de securitate, utilizatorii sunt sfătuiți să închidă fereastra browserului la finalul utilizării site-ului www.monza-ares-academy.ro.</p>
        </Section>

        <Section title="Suspendarea sau blocarea accesului">
          <p style={p}>MONZA CARDIO SRL poate, fără nicio notificare prealabilă sau formalitate și fără a fi necesară justificarea deciziei adoptate, să suspende sau să blocheze accesul dumneavoastră la conținutul site-ului sau la o parte a acestuia.</p>
        </Section>

        <Section title="Modificarea Termenilor și Condițiilor">
          <p style={p}>MONZA CARDIO SRL își rezervă dreptul de a modifica acești termeni, actualizând versiunea și data adoptării noului regulament, fără a fi necesară îndeplinirea unor alte formalități. Atunci când acești termeni vor suferi modificări, MONZA CARDIO SRL va publica pe prima pagină a site-ului un link care face trimitere la noua versiune a documentului.</p>
          <p style={p}>Accesarea site-ului după momentul notificării implică faptul că v-ați exprimat acordul asupra noilor termeni.</p>
        </Section>

        <Section title="Legea aplicabilă. Litigii">
          <p style={p}>Drepturile și obligațiile utilizatorilor site-ului, prevăzute de Termeni și Condiții, precum și toate efectele juridice pe care le generează acestea, vor fi interpretate și guvernate în conformitate cu legislația română în vigoare.</p>
          <p style={p}>Orice litigiu rezultat din sau în legătură cu Termenii și Condițiile va fi soluționat pe cale amiabilă de către părți. În cazul în care nu se ajunge la un acord, litigiul va fi soluționat de către instanța judecătorească română competentă.</p>
        </Section>

      </div>
    </main>
  )
}
