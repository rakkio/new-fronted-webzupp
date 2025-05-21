import React from 'react';
import Layout from '@/components/Layout';
import { FaCookieBite } from 'react-icons/fa';
import Head from 'next/head';

export default function CookiePolicy() {
  return (
    <Layout>
      <Head>
        <title>Politica dei Cookie | WebZUPP</title>
        <meta name="description" content="Informativa sui cookie utilizzati da WebZUPP" />
      </Head>
      
      <div className="max-w-4xl  mt-15 mx-auto text-black">
        <div className="mb-10 text-center">
          <FaCookieBite className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Politica dei Cookie</h1>
          <p className="text-xl text-gray-600">Informazioni su come utilizziamo i cookie sul nostro sito web</p>
        </div>
        
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700">
          <p className="text-gray-700 mb-6">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cosa sono i cookie?</h2>
            <p>
              I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo (computer, tablet o smartphone) 
              quando visiti un sito web. I cookie sono ampiamente utilizzati per far funzionare i siti web o per farli funzionare 
              in modo più efficiente, nonché per fornire informazioni ai proprietari del sito.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Come utilizziamo i cookie</h2>
            <p>
              Utilizziamo diversi tipi di cookie per vari scopi. I cookie ci aiutano a:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Rendere il nostro sito web funzionante correttamente</li>
              <li>Salvare le tue preferenze</li>
              <li>Migliorare la velocità e la sicurezza del sito</li>
              <li>Permetterti di condividere pagine sui social network</li>
              <li>Fornirti pubblicità più rilevante per te</li>
              <li>Analizzare come gli utenti utilizzano il nostro sito per migliorarlo costantemente</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Tipi di cookie che utilizziamo</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Cookie essenziali</h3>
            <p>
              Questi cookie sono necessari per il funzionamento del sito web e non possono essere disattivati nei nostri sistemi.
              Di solito vengono impostati solo in risposta ad azioni da te effettuate come la configurazione delle preferenze di privacy, 
              l'accesso o la compilazione di moduli. Puoi impostare il tuo browser per bloccare o avvisarti di questi cookie, 
              ma alcune parti del sito potrebbero non funzionare correttamente.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Cookie di performance e analitici</h3>
            <p>
              Questi cookie ci permettono di contare le visite e le fonti di traffico in modo da poter misurare e migliorare 
              le prestazioni del nostro sito. Ci aiutano a sapere quali sono le pagine più e meno popolari e vedere come i 
              visitatori si muovono all'interno del sito. Tutte le informazioni raccolte da questi cookie sono aggregate e quindi anonime.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Cookie funzionali</h3>
            <p>
              Questi cookie consentono al sito di fornire funzionalità e personalizzazione avanzate. Possono essere impostati 
              da noi o da provider terzi i cui servizi abbiamo aggiunto alle nostre pagine. Se non consenti questi cookie, 
              alcune o tutte queste funzionalità potrebbero non funzionare correttamente.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Cookie di targeting e pubblicitari</h3>
            <p>
              Questi cookie possono essere impostati attraverso il nostro sito dai nostri partner pubblicitari. Possono essere 
              utilizzati da queste aziende per costruire un profilo dei tuoi interessi e mostrarti annunci pertinenti su altri siti. 
              Non memorizzano direttamente informazioni personali, ma si basano sull'identificazione univoca del tuo browser e 
              dispositivo internet.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Cookie dei social media</h3>
            <p>
              Questi cookie sono impostati da una serie di servizi di social media che abbiamo aggiunto al sito per consentirti 
              di condividere i nostri contenuti con i tuoi amici e reti. Sono in grado di tracciare il tuo browser attraverso 
              altri siti e costruire un profilo dei tuoi interessi, e possono influenzare i contenuti e i messaggi che vedi su 
              altri siti web che visiti.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cookie di terze parti</h2>
            <p>
              Il nostro sito utilizza anche cookie di terze parti per vari servizi, tra cui:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Google Analytics (analisi del sito)</li>
              <li>Google AdSense (pubblicità)</li>
              <li>Facebook (condivisione e funzionalità social)</li>
              <li>Twitter (condivisione e funzionalità social)</li>
              <li>LinkedIn (condivisione e funzionalità social)</li>
            </ul>
            <p className="mt-4">
              Ciascuno di questi servizi ha le proprie politiche sulla privacy e sui cookie che puoi consultare sui loro siti web.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Come gestire i cookie</h2>
            <p>
              Puoi gestire i cookie modificando le impostazioni del tuo browser. I browser più comuni ti consentono di:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Visualizzare i cookie memorizzati e cancellarli singolarmente</li>
              <li>Bloccare i cookie di terze parti</li>
              <li>Bloccare i cookie di particolari siti</li>
              <li>Bloccare l'impostazione di tutti i cookie</li>
              <li>Eliminare tutti i cookie alla chiusura del browser</li>
            </ul>
            <p className="mt-4">
              Ti ricordiamo che il blocco o l'eliminazione dei cookie potrebbe impedire il corretto funzionamento del sito web.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Come disabilitare i cookie nei principali browser</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Google Chrome</h3>
            <p>
              Clicca sul menu nella barra degli strumenti del browser {'>'}  Seleziona Impostazioni {'>'}  Mostra impostazioni avanzate {'>'}  
              Nella sezione "Privacy" clicca su "Impostazioni contenuti" {'>'}  Seleziona l'opzione che preferisci nella sezione "Cookie".
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Mozilla Firefox</h3>
            <p>
              Clicca sul pulsante menu {'>'}  Seleziona Opzioni {'>'}  Seleziona il pannello Privacy {'>'}  Alla voce "Impostazioni cronologia" 
              seleziona "utilizza impostazioni personalizzate" {'>'}  Seleziona le opzioni che preferisci alla voce "Cookie".
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Microsoft Edge</h3>
            <p>
              Clicca sul menu "..." in alto a destra {'>'}  Seleziona Impostazioni {'>'}  Clicca su "Mostra impostazioni avanzate" {'>'}  
              Nella sezione "Cookie" seleziona l'opzione che preferisci.
            </p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Safari</h3>
            <p>
              Clicca su "Safari" nella barra dei menu {'>'}  Seleziona "Preferenze" {'>'}  Clicca sulla scheda "Privacy" {'>'}  
              Nella sezione "Cookie e dati di siti web" seleziona l'opzione che preferisci.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Il nostro banner dei cookie</h2>
            <p>
              Quando visiti il nostro sito web per la prima volta, vedrai un banner dei cookie che ti informa sull'uso dei cookie. 
              Puoi scegliere di accettare tutti i cookie, solo quelli essenziali, o personalizzare le tue preferenze. 
              Puoi modificare le tue preferenze in qualsiasi momento cliccando sul link "Impostazioni cookie" nel footer del nostro sito.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Modifiche alla politica dei cookie</h2>
            <p>
              Possiamo aggiornare la nostra politica dei cookie di tanto in tanto. Ti consigliamo di controllare questa pagina
              periodicamente per prendere visione di eventuali modifiche. Le modifiche a questa politica dei cookie entrano
              in vigore nel momento in cui vengono pubblicate su questa pagina.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contattaci</h2>
            <p>
              Se hai domande sulla nostra politica dei cookie, contattaci all'indirizzo:
            </p>
            <div className="mt-4">
              <p><strong>Email:</strong> privacy@webzupp.com</p>
              <p><strong>Indirizzo:</strong> Via Ticino, Romentino (NO)</p>
              <p><strong>Telefono:</strong> +39 351 555 2988</p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
} 