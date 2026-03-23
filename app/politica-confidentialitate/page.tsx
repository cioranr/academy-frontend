import type { ReactNode } from 'react'

const p: React.CSSProperties = {
  fontWeight: 300,
  fontSize: '15px',
  color: '#414042',
  lineHeight: 1.8,
  margin: 0,
  fontFamily: '"Roboto", sans-serif',
}

const bullet: React.CSSProperties = {
  ...p,
  paddingLeft: '4px',
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

function ContactBox() {
  return (
    <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '12px', borderLeft: '3px solid #065EA6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <p style={{ ...p, fontWeight: 500, color: '#065EA6' }}>MONZA CARDIO SRL</p>
      <p style={p}>Adresă: STR. TONY BULANDRA NR. 27, SECTOR 2, BUCUREȘTI (INCINTA SPITALULUI MONZA), COD POȘTAL 021967</p>
      <p style={p}>Telefon: <a href="tel:0319300" style={{ color: '#065EA6' }}>031 9300</a> (disponibil între orele 08:00 – 20:00)</p>
      <p style={p}>Email: <a href="mailto:marketing@monza-ares.ro" style={{ color: '#065EA6' }}>marketing@monza-ares.ro</a></p>
      <p style={p}>Website: <a href="https://monza-ares-academy.ro" style={{ color: '#065EA6' }}>https://monza-ares-academy.ro</a></p>
    </div>
  )
}

function DPOBox() {
  return (
    <div style={{ padding: '16px 20px', background: '#fff', borderRadius: '12px', borderLeft: '3px solid #065EA6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <p style={{ ...p, fontWeight: 500, color: '#065EA6' }}>Responsabil cu protecția datelor (DPO)</p>
      <p style={p}>Radu Taracila Padurari Retevoescu SCA (RTPR)</p>
      <p style={p}>Adresă: Piața Charles de Gaulle nr. 15, etaj 5, sector 1, București, cod poștal 011857</p>
      <p style={p}>Email: <a href="mailto:dpoares@rtpr.ro" style={{ color: '#065EA6' }}>dpoares@rtpr.ro</a></p>
    </div>
  )
}

export default function PoliticaConfidentialitatePage() {
  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', fontFamily: '"Roboto", sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>

        <h1 style={{ fontWeight: 300, fontSize: '32px', color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: '"Roboto", sans-serif' }}>
          Politica de confidențialitate
        </h1>
        <p style={{ ...p, marginBottom: '40px', fontSize: '13px', color: '#9ca3af' }}>Notă de informare generală privind prelucrarea datelor cu caracter personal</p>

        <Section title="Despre această notă">
          <p style={p}>În acest document vă explicăm modul în care <strong>MONZA CARDIO SRL</strong> și alte companii ce fac parte din Grupul Monza Ares prelucrează datele dumneavoastră cu caracter personal și în care asigură protecția acestora, conform legislației aplicabile, inclusiv Regulamentul (UE) 2016/679 (GDPR).</p>
          <p style={p}>Acest document este relevant pentru dumneavoastră indiferent de poziția în care vă aflați: client, partener, reprezentant al unui partener, solicitant al unei oferte, vizitator al unuia dintre sediile noastre, fost/actual/potențial angajat, intern sau vizitator al site-ului nostru.</p>
        </Section>

        <Section title="1. Categorii de date. Scop. Temei">
          <p style={{ ...p, fontWeight: 500, color: '#1a3a6b' }}>1.1 Clienți actuali sau potențiali</p>
          <p style={p}>Putem prelucra date cu caracter personal pentru: furnizarea serviciilor noastre (date de identificare, date contractuale inclusiv date medicale necesare executării contractului), soluționarea cererilor dumneavoastră (nume, prenume, date de contact, informații din cerere) și comunicare în scop de marketing (pe baza consimțământului dumneavoastră).</p>

          <p style={{ ...p, fontWeight: 500, color: '#1a3a6b', marginTop: '8px' }}>1.2 Membri ai partenerilor contractuali – persoane juridice</p>
          <p style={p}>Putem prelucra datele dumneavoastră pentru menținerea relației contractuale cu compania din care faceți parte (nume, prenume, poziție, angajator, număr de telefon, adresă de e-mail) și pentru comunicare în scop de marketing, pe baza consimțământului sau a intereselor noastre legitime.</p>

          <p style={{ ...p, fontWeight: 500, color: '#1a3a6b', marginTop: '8px' }}>1.3 Parteneri contractuali – persoane fizice</p>
          <p style={p}>Putem prelucra datele dumneavoastră pentru desfășurarea relațiilor de afaceri (nume, prenume, date din actul de identitate), soluționarea cererilor și comunicare de marketing.</p>

          <p style={{ ...p, fontWeight: 500, color: '#1a3a6b', marginTop: '8px' }}>1.4 Membri ai autorităților publice</p>
          <p style={p}>Vom utiliza datele dumneavoastră pentru îndeplinirea obligațiilor noastre legale, cum ar fi răspunsul la solicitările autorităților sau ținerea de registre prevăzute de lege.</p>

          <p style={{ ...p, fontWeight: 500, color: '#1a3a6b', marginTop: '8px' }}>1.5 Candidați la poziții/stagii de practică</p>
          <p style={p}>Putem prelucra datele incluse în aplicația dumneavoastră (nume, prenume, date de contact, experiență profesională, studii și orice alte informații din CV) pentru desfășurarea procesului de recrutare.</p>

          <p style={{ ...p, fontWeight: 500, color: '#1a3a6b', marginTop: '8px' }}>1.6 Vizitatori ai sediului sau punctelor de lucru</p>
          <p style={p}>În unele dintre incintele noastre avem instalate camere de supraveghere video (CCTV) pentru a asigura securitatea angajaților și a bunurilor noastre. De asemenea, la recepție vom prelucra datele din actul dumneavoastră de identitate și informații privind scopul vizitei.</p>

          <p style={{ ...p, fontWeight: 500, color: '#1a3a6b', marginTop: '8px' }}>1.7 Vizitatori ai site-urilor noastre</p>
          <p style={p}>Putem prelucra date pentru îmbunătățirea experienței pe website (adresă IP, identificatori cookies, alți identificatori online, data și ora accesării, istoricul vizitelor, tipul de browser, informații despre localizare) și pentru gestionarea sistemelor IT. Pentru mai multe informații, consultați <a href="/politica-cookies" style={{ color: '#065EA6' }}>Politica privind cookies</a>.</p>

          <p style={{ ...p, fontWeight: 500, color: '#1a3a6b', marginTop: '8px' }}>1.8 Scopuri generale</p>
          <p style={p}>Indiferent de poziția în care vă aflați, putem prelucra datele dumneavoastră pentru: soluționarea cererilor, răspuns la solicitările autorităților, realizarea unor tranzacții sau restructurări, apărarea drepturilor și intereselor noastre și prevenirea fraudelor.</p>

          <p style={{ ...p, fontWeight: 500, color: '#1a3a6b', marginTop: '8px' }}>1.9 Datele terților</p>
          <p style={p}>Dacă ne transmiteți date cu caracter personal privitoare la alte persoane, trebuie să vă asigurați că i-ați informat despre aceasta și că i-ați îndrumat spre această informare.</p>
        </Section>

        <Section title="2. Cui vom divulga datele cu caracter personal">
          <p style={p}>Ca regulă, nu vom divulga datele dumneavoastră către alte persoane fizice sau juridice. Cu toate acestea, în anumite cazuri este posibil să fie nevoie să divulgăm datele dumneavoastră către: alte companii din Grupul Monza Ares, persoane juridice care acționează ca persoane împuternicite (arhivare, stocare date, servicii de plată), instanțe sau autorități publice.</p>
          <p style={p}>În toate aceste cazuri ne vom asigura că destinatarii prelucrează datele în condiții de securitate și confidențialitate, în conformitate cu scopul pentru care le-am transmis.</p>
        </Section>

        <Section title="3. Transferuri către state terțe">
          <p style={p}>În acest moment nu transferăm și nu intenționăm să transferăm datele dumneavoastră cu caracter personal către alte companii, organizații sau persoane din state terțe sau către organizații internaționale. Dacă va fi necesar, vă vom informa în avans.</p>
        </Section>

        <Section title="4. Cât vom păstra datele dumneavoastră">
          <p style={p}>Vom stoca datele dumneavoastră în conformitate cu politica noastră de stocare, care atribuie o perioadă de stocare în funcție de scopul prelucrării și categoria de date prelucrate. Perioadele sunt bazate pe prevederile legale, obligațiile de stocare, termenele de prescripție aplicabile și scopurile activității noastre.</p>
        </Section>

        <Section title="5. Ce se poate întâmpla dacă nu ne furnizați datele">
          <p style={p}>În cele mai multe cazuri, nu aveți o obligație de a ne furniza datele dumneavoastră. Totuși, dacă nu ne furnizați datele solicitate, nu vom putea, de exemplu, să încheiem sau să negociem un contract cu dumneavoastră, să vă prestăm serviciile noastre, să vă permitem acces la toate opțiunile de pe website sau să vă răspundem la reclamații sau solicitări.</p>
        </Section>

        <Section title="6. Inexistența unui proces decizional automatizat">
          <p style={p}>Nu luăm decizii bazate exclusiv pe prelucrarea automată a datelor dumneavoastră (inclusiv crearea de profiluri) care să producă efecte juridice sau care să vă afecteze într-un mod similar într-o măsură semnificativă.</p>
        </Section>

        <Section title="7. Drepturile dumneavoastră">
          <p style={p}>Aveți următoarele drepturi în legătură cu datele dumneavoastră cu caracter personal:</p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { title: 'Dreptul de acces la date', desc: 'Aveți dreptul de a obține accesul la datele privitoare la dumneavoastră pe care le prelucrăm sau copii ale acestora.' },
              { title: 'Dreptul la rectificarea datelor', desc: 'Aveți dreptul de a obține rectificarea inexactităților datelor privitoare la dumneavoastră pe care le prelucrăm.' },
              { title: 'Dreptul la ștergerea datelor („dreptul de a fi uitat")', desc: 'Aveți dreptul de a obține de la noi ștergerea datelor privitoare la dumneavoastră.' },
              { title: 'Dreptul la restricționarea prelucrării', desc: 'Aveți dreptul de a restricționa prelucrarea datelor privitoare la dumneavoastră.' },
              { title: 'Dreptul de a obiecta', desc: 'Aveți dreptul de a obiecta la prelucrarea datelor privitoare la dumneavoastră de către noi sau în numele nostru.' },
              { title: 'Dreptul la portabilitatea datelor', desc: 'Aveți dreptul de a obține transferul către un alt operator al datelor privitoare la dumneavoastră.' },
              { title: 'Dreptul la retragerea consimțământului', desc: 'Puteți retrage consimțământul în orice moment, cel puțin la fel de ușor cum ni l-ați acordat inițial. Retragerea nu afectează legalitatea prelucrărilor anterioare.' },
              { title: 'Dreptul de a depune o plângere', desc: 'Aveți dreptul de a depune o plângere la ANSPDCP (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal). Detalii pe www.dataprotection.ro.' },
            ].map((item, i) => (
              <li key={i} style={bullet}><strong style={{ fontWeight: 500 }}>{item.title}:</strong> {item.desc}</li>
            ))}
          </ul>
          <p style={p}>Pentru a exercita aceste drepturi sau pentru orice întrebare, vă rugăm să utilizați detaliile de contact de mai jos.</p>
        </Section>

        <Section title="8. Datele noastre de contact">
          <ContactBox />
          <DPOBox />
        </Section>

        <Section title="9. Când se aplică această informare">
          <p style={p}>Această informare generală se aplică în legătură cu prelucrarea datelor referitoare la dumneavoastră de către companiile din Grupul Monza Ares. Această informare nu se aplică în legătură cu servicii sau produse oferite de alte companii sau persoane fizice.</p>
        </Section>

        <Section title="10. Modificările acestei politici">
          <p style={p}>Este posibil să modificăm această politică. În astfel de cazuri, vă vom informa în avans, prin postarea acestei politici pe website cu 20 de zile înainte de intrarea sa în vigoare.</p>
          <p style={{ ...p, fontSize: '13px', color: '#9ca3af' }}>Această versiune a politicii a intrat în vigoare la 13.01.2021.</p>
        </Section>

        <Section title="11. Glosar de termeni">
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { title: 'Date cu caracter personal', desc: 'Orice informații privind o persoană fizică identificată sau identificabilă (nume, adresă, email, telefon, CNP, date medicale, date de geolocație etc.).' },
              { title: 'Operator', desc: 'Persoana juridică care decide de ce și cum sunt prelucrate datele cu caracter personal. În relația cu dumneavoastră, noi suntem operatorul.' },
              { title: 'Persoană împuternicită', desc: 'Orice persoană fizică sau juridică care prelucrează date cu caracter personal în numele operatorului, alta decât angajații operatorului.' },
              { title: 'Persoană vizată', desc: 'Persoana fizică la care se referă anumite date cu caracter personal. În relația cu noi, dumneavoastră sunteți persoana vizată.' },
              { title: 'Categorii speciale de date (date sensibile)', desc: 'Date care dezvăluie originea rasială sau etnică, opiniile politice, confesiunea religioasă, apartenența la sindicate, datele genetice, biometrice, privind sănătatea, viața sexuală sau orientarea sexuală.' },
              { title: 'Stat terț', desc: 'Un stat din afara Uniunii Europene și a Spațiului Economic European.' },
              { title: 'Autoritatea de supraveghere', desc: 'În România, Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP) — www.dataprotection.ro.' },
            ].map((item, i) => (
              <li key={i} style={bullet}><strong style={{ fontWeight: 500 }}>{item.title}:</strong> {item.desc}</li>
            ))}
          </ul>
        </Section>

      </div>
    </main>
  )
}
