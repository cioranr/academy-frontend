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

export default function PoliticaCookiesPage() {
  return (
    <main style={{ background: '#ecffff', minHeight: '100vh', fontFamily: '"Roboto", sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px' }}>

        <h1 style={{ fontWeight: 300, fontSize: '32px', color: '#6D6E71', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '40px', fontFamily: '"Roboto", sans-serif' }}>
          Politica cookies
        </h1>

        <Section title="Cum folosim cookie-urile?">
          <p style={p}>Vă mulțumim pentru accesarea site-ului nostru! Acest site este operat de MONZA CARDIO SRL.</p>
          <p style={p}>La fel ca majoritatea site-urilor de internet, și <strong>www.monza-ares-academy.ro</strong> folosește cookie-uri. Scopurile sunt multiple – de la îmbunătățirea și personalizarea experienței dumneavoastră de navigare, până la reținerea unora dintre preferințele ori datele dumneavoastră – setarea limbii de navigare, protejarea securității sistemelor – atât ale dumneavoastră, cât și ale noastre, ori realizarea de statistici.</p>
          <p style={p}>În plus, unele cookie-uri ne oferă indicii importante despre modul în care vizitatorii folosesc site-ul nostru, care ne permit apoi să îl facem mai adecvat nevoilor lor. Alte cookie-uri ne permit inclusiv să cuantificăm câți utilizatori accesează site-ul nostru într-o perioadă de referință.</p>
          <p style={p}>Pentru că transparența este o valoare-cheie în cadrul Grupului Monza Ares, mai jos vă oferim detalii cu privire la cookie-urile de pe acest site și la opțiunile pe care le aveți cu privire la activarea sau dezactivarea lor. Vă rugăm să aveți în vedere că, la fel ca toate site-urile, și site-ul nostru se bazează pe această tehnologie pentru a putea funcționa în condiții optime; dacă optați pentru a nu permite funcționarea ei, calitatea experienței dumneavoastră de navigare ar putea fi afectată.</p>
        </Section>

        <Section title="Ce este un cookie?">
          <p style={p}>Probabil ați întâlnit de-a lungul timpului referiri la Internet cookies, browser cookies sau HTTP cookies. De fapt, acestea sunt mai multe denumiri pentru una și aceeași tehnologie, denumită mai simplu cookie.</p>
          <p style={p}>Din punct de vedere tehnic, un cookie reprezintă un fragment de text (i.e., litere și numere) de mici dimensiuni, care va fi stocat pe calculatorul, telefonul mobil sau alte echipamente ale unui utilizator de pe care se accesează un website. Un cookie este format din două părți: numele și conținutul (sau valoarea) acestuia.</p>
        </Section>

        <Section title="De ce sunt utile cookie-urile?">
          <p style={p}>Cu ajutorul cookie-urilor, site-urile rețin informații despre vizita utilizatorilor, cum ar fi: limba preferată, tipul de dispozitiv folosit (calculator, telefon mobil) pentru a accesa site-ul. Cookie-urile permit simplificarea experienței de navigare pe un site, iar deținătorii site-urilor au posibilitatea de a oferi informații mai relevante utilizatorilor, adaptate nevoilor lor.</p>
          <p style={p}>Practic, cookie-urile ajută la funcționarea eficientă a Internetului și au ca rezultat navigarea prietenoasă și personalizată fiecărui utilizator. Fără ele, site-urile de pe Internet ar fi mult mai nepractice și ar avea o funcționare mai greoaie.</p>
          <p style={p}>Mai mult, cookie-urile ajută deținătorii de site-uri să le dezvolte continuu. Cookie-urile pot obține informații valoroase asupra modului în care este utilizat website-ul de către vizitatori, cum ar fi care sunt paginile cel mai des vizitate, astfel încât să se poată furniza acestora experiențe din ce în ce mai bune în navigare.</p>
        </Section>

        <Section title="Cum clasificăm cookie-urile?">
          <p style={p}>În funcție de modul de ștergere, există <strong>(i) cookie-uri care sunt șterse imediat ce închideți browser-ul de Internet</strong> (denumite și cookie-uri de sesiune), dar și <strong>(ii) cookie-uri care sunt stocate pe dispozitivul dumneavoastră</strong> cu scopul de a fi folosite inclusiv pentru următoarele dumneavoastră vizite pe site (denumite și „cookie-uri persistente", deși expiră totuși după o perioadă de timp). Cookie-urile persistente se reactivează atunci când vizitați din nou site-ul care le-a plasat pe dispozitivul dumneavoastră.</p>
          <p style={p}>În funcție de persoana care le plasează pe dispozitivul dumneavoastră, există cookie-uri proprii sau cookie-uri plasate de alte persoane (denumite și cookie-uri de la terți).</p>
        </Section>

        <Section title="Cât durează un cookie?">
          <p style={p}>Durata de viață a cookie-urilor variază de la caz la caz, în funcție de scopul acestuia. Unele cookie-uri sunt folosite doar pentru o singură sesiune de navigare, iar altele persistă pentru o perioadă de timp determinată după ce părăsiți site-ul. Independent de tipul de cookie-uri, puteți alege oricând să le ștergeți sau dezactivați.</p>
        </Section>

        <Section title="Sunt cookie-urile periculoase pentru dispozitivul meu?">
          <p style={p}>Cookie-urile sunt inofensive. Nu conțin programe, viruși sau alte fișiere dăunătoare și nu pot accesa informațiile de pe dispozitivul utilizatorului. Deoarece cookie-urile sunt instalate prin solicitarea unui browser Internet, doar acel webserver care le-a trimis poate să le acceseze din nou atunci când utilizatorul revine pe site-ul asociat.</p>
          <p style={p}>Este adevărat, cookie-urile pot fi folosite și în scopuri negative, ca o formă de spyware. Multe produse anti-spyware marchează însă cookie-urile pentru a fi șterse în cadrul procedurilor de scanare anti-virus/anti-spyware.</p>
          <p style={p}>În general, browser-ele au setări de confidențialitate care furnizează diferite nivele de acceptare a cookie-urilor, perioada de valabilitate și de ștergere automată după ce utilizatorul a vizitat un website.</p>
        </Section>

        <Section title="Ce legătură au cookie-urile cu datele mele cu caracter personal?">
          <p style={p}>Unele cookie-uri colectează informații anonime, care nu spun nimic despre dumneavoastră. Altele colectează informații care vă pot identifica – de exemplu, adresa IP.</p>
        </Section>

        <Section title="Folosește site-ul www.monza-ares-academy.ro cookie-uri?">
          <p style={p}>De principiu, orice site folosește cookie-uri. Cel mai probabil, fără ele, Internetul nu ar fi ce este astăzi.</p>
          <p style={p}>Website-ul www.monza-ares-academy.ro folosește cookie-uri proprii și de la terți pentru a furniza vizitatorilor o experiență de navigare superioară și servicii plăcute, utile și adaptate nevoilor specifice ale acestora.</p>
        </Section>

        <Section title="În ce scopuri folosește site-ul www.monza-ares-academy.ro cookie-uri?">
          <p style={p}>Folosim cookie-uri pe site-ul www.monza-ares-academy.ro pentru mai multe scopuri specifice. De exemplu:</p>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              'pentru a îmbunătăți arhitectura site-ului și pentru a-i realiza mentenanța;',
              'pentru îmbunătățirea parametrilor de siguranță ai site-ului;',
              'pentru a ține cont de preferințele dumneavoastră, personalizând experiența dumneavoastră;',
              'pentru a soluționa problemele pe care le-ați putea întâmpina la accesare;',
              'pentru publicitate;',
              'pentru efectuarea analizei datelor și monitorizarea tendințelor de utilizare.',
            ].map((item, i) => (
              <li key={i} style={p}>{item}</li>
            ))}
          </ol>
          <p style={p}>Pe acest site sunt prezente atât cookie-urile noastre, cât și cookie-uri ale unor terți.</p>
        </Section>

        <Section title="Cookie-urile noastre">
          <p style={p}>În multe cazuri, cookie-urile nu preiau informații asociate unei persoane identificate sau identificabile. Aceasta înseamnă că acele cookie-uri nu vor reține datele dumneavoastră cu caracter personal, așa încât identitatea dumneavoastră va rămâne anonimă.</p>
          <p style={p}>Pentru a vizualiza cookie-urile active pe website-ul nostru, vă rugăm să apăsați pe butonul SETĂRI din Pop-up-ul „Despre cookie-urile de pe acest site", apoi Declarație Cookie.</p>
        </Section>

        <Section title="Cookie-uri ale terților">
          <p style={p}>Există situații în care anumite părți din alte site-uri pot apărea pe site-ul nostru. Spre exemplu, un buton de like al Facebook sau un videoclip de pe Youtube. Atunci când aceste elemente apar pe site-ul nostru, înseamnă că le-am permis companiilor care dețin platformele respective să plaseze cookie-uri pe el.</p>
          <p style={p}>Permitem un număr de cookie-uri de la terți pe site-ul nostru, însă accesul nu este deschis oricui. Cookie-urile de la terți sunt folosite în primul rând pentru a vă oferi o experiență mai utilă și pentru a realiza statistici.</p>
          <p style={p}>Întrucât aceste cookie-uri și informațiile pe care le-ar putea colecta nu sunt sub controlul nostru, vă rugăm să consultați politica respectivilor furnizori pentru mai multe informații.</p>
        </Section>

        <Section title="Pot dezactiva cookie-urile?">
          <p style={p}>Da, este posibil. Este posibilă setarea din browser pentru a nu mai fi acceptate cookie-urile. De asemenea, browser-ul poate fi setat astfel încât să accepte doar cookie-uri de la un anume site.</p>
          <p style={p}>În prezent, toate browser-ele moderne oferă posibilitatea de a schimba setările cookie-urilor. Pentru mai multe detalii, accesați opțiunea „ajutor / help" a browser-ului dumneavoastră.</p>
          <p style={{ ...p, fontWeight: 400 }}><strong>Atenție!</strong> Blocarea modulelor cookies poate să conducă la afișarea incorectă a unor pagini de Internet.</p>
        </Section>

        <Section title="Vreți să aflați mai multe despre cookie-uri?">
          <p style={p}>Dacă doriți să aflați mai multe informații despre cookie-uri în general, o sursă utilă este site-ul <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" style={{ color: '#065EA6' }}>www.allaboutcookies.org</a>.</p>
          <p style={p}>Dacă doriți să aflați mai multe despre cookie-urile noastre, ne puteți contacta la detaliile de mai jos.</p>
        </Section>

        <Section title="Cum ne puteți contacta?">
          <p style={p}>Dacă aveți orice comentarii, sugestii, întrebări sau preocupări cu privire la cookie-urile de pe acest site, vă stăm la dispoziție.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={p}><strong style={{ fontWeight: 500 }}>Email:</strong>{' '}<a href="mailto:Marketing@monza-ares.ro" style={{ color: '#065EA6' }}>Marketing@monza-ares.ro</a></p>
            <p style={p}><strong style={{ fontWeight: 500 }}>Adresă:</strong> Tony Bulandra 27, sector 2, București – Spitalul Monza</p>
          </div>
          <div style={{ marginTop: '8px', padding: '16px 20px', background: '#fff', borderRadius: '12px', borderLeft: '3px solid #065EA6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ ...p, fontWeight: 500, color: '#065EA6' }}>Responsabil protecția datelor cu caracter personal:</p>
            <p style={p}>Radu Taracila Padurari Retevoescu SCA (RTPR)</p>
            <p style={p}>Adresă: Piața Charles de Gaulle nr. 15, etaj 5, sector 1, București, cod poștal 011857</p>
            <p style={p}>Email: <a href="mailto:dpoares@rtpr.ro" style={{ color: '#065EA6' }}>dpoares@rtpr.ro</a></p>
          </div>
        </Section>

      </div>
    </main>
  )
}
