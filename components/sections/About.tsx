// src/components/sections/About.tsx

export function About() {
  return (
    <section className="bg-white py-2">
      <div className="max-w-xl mx-auto px-6 text-center">
        

        <h2
          className="font-display  mb-6"
          style={{ fontFamily: '"Roboto", sans-serif', fontWeight: 300, fontSize: '28px', color: '#000' }}
        >
          MONZA ARES Academy
        </h2>

        <p className="text-monza-muted leading-relaxed text-[13px] mb-4 max-w-3xl mx-auto">
          MONZA ARES Academy este platforma educațională a celei mai mari rețele private
          integrate de cardiologie din România, dedicată formării și perfecționării continue.
        </p>
        <p className="text-monza-muted leading-relaxed text-[13px] mb-4 max-w-3xl mx-auto">
          Academia dezvoltă programe de training, workshopuri practice, cursuri avansate
          și inițiative de schimb de expertiză, aliniate celor mai noi practici și
          protocoale internaționale în cardiologia modernă.
        </p>
        <p className="text-monza-muted leading-relaxed text-[13px] max-w-3xl mx-auto mb-10">
          Se adresează medicilor cardiologi, medicilor rezidenți, specialiștilor din
          discipline complementare și tuturor profesioniștilor implicați în prevenția,
          diagnosticul și tratamentul afecțiunilor cardiovasculare.
        </p>

        <button className="btn-primary mx-auto cursor-pointer" style={{fontFamily: '"Roboto", sans-serif', fontWeight: 300,}}>
          Despre noi
          
        </button>
      </div>
    </section>
  )
}
