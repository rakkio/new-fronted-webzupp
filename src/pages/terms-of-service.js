import React from 'react';
import Layout from '@/components/Layout';
import { FaFileContract } from 'react-icons/fa';
import Head from 'next/head';

export default function TermsOfService() {
  return (
    <Layout>
      <Head>
        <title>Termini di Servizio | WebZUPP</title>
        <meta name="description" content="Termini e condizioni di utilizzo dei servizi WebZUPP" />
      </Head>
      
      <div className="max-w-4xl  mt-15 mx-auto text-black">
        <div className="mb-10 text-center">
          <FaFileContract className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Termini di Servizio</h1>
          <p className="text-xl text-gray-600">Condizioni generali di utilizzo dei nostri servizi</p>
        </div>
        
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700">
          <p className="text-gray-700 mb-6">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduzione</h2>
            <p>
              Benvenuto su WebZUPP. I presenti Termini di Servizio ("Termini") regolano l'utilizzo del sito web, 
              dei prodotti, dei servizi e delle applicazioni (collettivamente i "Servizi") offerti da WebZUPP ("noi", "nostro" o "la nostra azienda").
            </p>
            <p className="mt-4">
              Utilizzando i nostri Servizi, accetti di essere vincolato da questi Termini. Se non accetti questi Termini, ti preghiamo di non utilizzare i nostri Servizi.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Definizioni</h2>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li><strong>"Contenuto"</strong>: indica qualsiasi informazione, testo, grafica, foto, video o altro materiale caricato, scaricato o visualizzato sui nostri Servizi.</li>
              <li><strong>"Utente"</strong>: indica qualsiasi persona che accede o utilizza i nostri Servizi.</li>
              <li><strong>"Account"</strong>: indica un account registrato per accedere ai nostri Servizi.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Registrazione e Account</h2>
            <p>
              Per utilizzare alcune funzionalità dei nostri Servizi, potrebbe essere necessario creare un account e fornire determinate informazioni.
              Tu sei responsabile di:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Mantenere la riservatezza della tua password</li>
              <li>Limitare l'accesso al tuo computer o dispositivo</li>
              <li>Tutte le attività che si verificano con il tuo account</li>
            </ul>
            <p className="mt-4">
              Ci riserviamo il diritto di disabilitare qualsiasi account in qualsiasi momento, se riteniamo che tu abbia violato questi Termini.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Utilizzo dei Servizi</h2>
            <p>
              Utilizzando i nostri Servizi, accetti di:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Non violare leggi o regolamenti applicabili</li>
              <li>Non violare diritti di proprietà intellettuale o altri diritti di terzi</li>
              <li>Non interferire con il normale funzionamento dei nostri Servizi</li>
              <li>Non utilizzare i nostri Servizi per scopi fraudolenti o illegali</li>
              <li>Non trasmettere malware, virus o altro codice dannoso</li>
              <li>Non tentare di accedere non autorizzato ai nostri sistemi o reti</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Contenuti e Proprietà Intellettuale</h2>
            <p>
              I contenuti presenti sui nostri Servizi, inclusi testi, grafiche, loghi, immagini, video, audio e software,
              sono di proprietà di WebZUPP o dei suoi licenzianti e sono protetti dalle leggi sulla proprietà intellettuale.
            </p>
            <p className="mt-4">
              Ti concediamo una licenza limitata, non esclusiva, non trasferibile e revocabile per accedere e utilizzare i nostri
              Servizi e Contenuti per scopi personali e non commerciali.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Contenuti dell'Utente</h2>
            <p>
              Alcuni dei nostri Servizi ti permettono di pubblicare, caricare o trasmettere contenuti. Conservi tutti i diritti
              di proprietà intellettuale sui tuoi contenuti, ma ci concedi una licenza mondiale, non esclusiva, gratuita per utilizzare,
              riprodurre, modificare, adattare, pubblicare e distribuire tali contenuti in relazione ai nostri Servizi.
            </p>
            <p className="mt-4">
              Ti assumi la piena responsabilità per i contenuti che pubblichi e garantisci di avere il diritto di concederci la licenza sopra descritta.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Pagamenti e Fatturazione</h2>
            <p>
              Per alcuni Servizi a pagamento, ti verranno addebitati i costi secondo le tariffe in vigore al momento della sottoscrizione.
              Tutti i pagamenti sono non rimborsabili, salvo diversamente specificato o richiesto dalla legge.
            </p>
            <p className="mt-4">
              Ci riserviamo il diritto di modificare i prezzi dei nostri Servizi in qualsiasi momento, previa comunicazione.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Limitazione di Responsabilità</h2>
            <p>
              Nei limiti consentiti dalla legge, WebZUPP e i suoi amministratori, dipendenti e affiliati non saranno responsabili
              per eventuali danni indiretti, incidentali, speciali, consequenziali o punitivi derivanti dall'utilizzo o 
              dall'impossibilità di utilizzare i nostri Servizi.
            </p>
            <p className="mt-4">
              La nostra responsabilità complessiva derivante dai presenti Termini o dall'utilizzo dei nostri Servizi non supererà
              l'importo pagato dall'utente per l'accesso ai nostri Servizi negli ultimi 12 mesi.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Indennizzo</h2>
            <p>
              Accetti di indennizzare, difendere e manlevare WebZUPP e i suoi amministratori, dipendenti e affiliati da qualsiasi
              reclamo, danno, obbligazione, perdita, responsabilità, costo o debito e spesa derivante da:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Il tuo utilizzo e accesso ai Servizi</li>
              <li>La tua violazione di qualsiasi termine dei presenti Termini</li>
              <li>La tua violazione di diritti di terzi, inclusi, a titolo esemplificativo, diritti di proprietà intellettuale</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Modifiche ai Termini</h2>
            <p>
              Ci riserviamo il diritto di modificare questi Termini in qualsiasi momento. Le modifiche avranno effetto
              immediatamente dopo la pubblicazione dei Termini aggiornati sul nostro sito web. Il tuo utilizzo
              continuato dei nostri Servizi dopo tali modifiche costituisce l'accettazione dei nuovi Termini.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Legge Applicabile</h2>
            <p>
              Questi Termini saranno regolati e interpretati in conformità con le leggi italiane, senza riguardo
              alle disposizioni sul conflitto di leggi.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Risoluzione delle Controversie</h2>
            <p>
              Qualsiasi controversia derivante da o in connessione con questi Termini sarà sottoposta alla giurisdizione
              esclusiva dei tribunali di Novara, Italia.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Disposizioni Generali</h2>
            <p>
              Se una qualsiasi disposizione di questi Termini è ritenuta non valida o inapplicabile, tale disposizione sarà
              limitata o eliminata nella misura minima necessaria, e le restanti disposizioni rimarranno in pieno vigore ed efficacia.
            </p>
            <p className="mt-4">
              Il nostro mancato esercizio o applicazione di qualsiasi diritto o disposizione dei Termini non costituirà una rinuncia
              a tale diritto o disposizione.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">14. Contattaci</h2>
            <p>
              Se hai domande su questi Termini di Servizio, contattaci all'indirizzo:
            </p>
            <div className="mt-4">
              <p><strong>Email:</strong> legal@webzupp.com</p>
              <p><strong>Indirizzo:</strong> Via Ticino, Romentino (NO)</p>
              <p><strong>Telefono:</strong> +39 351 555 2988</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 