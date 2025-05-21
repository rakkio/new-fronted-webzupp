import React from 'react';
import Layout from '@/components/Layout';
import { FaShieldAlt } from 'react-icons/fa';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy | WebZUPP</title>
        <meta name="description" content="Informativa sulla privacy di WebZUPP" />
      </Head>
      
      <div className="max-w-4xl  mt-15 mx-auto">
        <div className="mb-10 text-center">
          <FaShieldAlt className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Informativa sulla Privacy</h1>
          <p className="text-xl text-gray-600">Come proteggiamo e gestiamo i tuoi dati personali</p>
        </div>
        
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700">
          <p className="text-gray-700 mb-6">
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <section className="mb-8 text-black" >
            <h2 className="text-2xl font-bold mb-4">Introduzione</h2>
            <p>
              WebZUPP ("noi", "nostro" o "la nostra azienda") rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. 
              Questa informativa sulla privacy ti spiegherà come raccogliamo, utilizziamo, condividiamo e proteggiamo i tuoi dati 
              quando utilizzi il nostro sito web e i nostri servizi.
            </p>
          </section>
          
          <section className="mb-8 text-black">
            <h2 className="text-2xl font-bold mb-4">Dati che raccogliamo</h2>
            <p>
              Raccogliamo diversi tipi di informazioni, tra cui:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>
                <strong>Dati identificativi:</strong> come nome, cognome, indirizzo email, numero di telefono, 
                indirizzo postale, quando ci contatti o crei un account.
              </li>
              <li>
                <strong>Dati di utilizzo:</strong> informazioni su come utilizzi il nostro sito web, 
                quali pagine visiti, per quanto tempo e quali interazioni effettui.
              </li>
              <li>
                <strong>Dati tecnici:</strong> indirizzo IP, tipo di browser, dispositivo, sistema operativo, 
                e altre informazioni tecniche.
              </li>
              <li>
                <strong>Dati relativi ai cookie:</strong> informazioni raccolte tramite cookie e tecnologie simili 
                che utilizziamo per migliorare la tua esperienza sul nostro sito.
              </li>
            </ul>
          </section>
          
          <section className="mb-8 text-black">
            <h2 className="text-2xl font-bold mb-4">Come utilizziamo i tuoi dati</h2>
            <p>
              Utilizziamo i tuoi dati personali per le seguenti finalità:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Fornirti i servizi che hai richiesto</li>
              <li>Elaborare e gestire i tuoi ordini</li>
              <li>Comunicare con te riguardo ai nostri servizi</li>
              <li>Migliorare e personalizzare la tua esperienza sul nostro sito</li>
              <li>Inviare newsletter e comunicazioni di marketing (con il tuo consenso)</li>
              <li>Adempiere agli obblighi legali e fiscali</li>
              <li>Rilevare e prevenire frodi o attività illegali</li>
            </ul>
          </section>
          
          <section className="mb-8 text-black">
            <h2 className="text-2xl font-bold mb-4">Base giuridica del trattamento</h2>
            <p>
              Trattiamo i tuoi dati personali sulla base di una o più delle seguenti basi giuridiche:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Il tuo consenso esplicito</li>
              <li>L'esecuzione di un contratto di cui sei parte</li>
              <li>L'adempimento di obblighi legali</li>
              <li>Il perseguimento di legittimi interessi nostri o di terzi</li>
            </ul>
          </section>
          
          <section className="mb-8 text-black">
            <h2 className="text-2xl font-bold mb-4">Condivisione dei dati</h2>
            <p>
              Potremmo condividere i tuoi dati personali con:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Fornitori di servizi che ci aiutano nell'erogazione dei nostri servizi</li>
              <li>Partner commerciali per offrirti prodotti o servizi congiunti</li>
              <li>Autorità pubbliche quando richiesto dalla legge</li>
              <li>Professionisti e consulenti esterni che ci forniscono servizi</li>
            </ul>
            <p className="mt-4">
              Non vendiamo mai i tuoi dati personali a terzi per finalità di marketing.
            </p>
          </section>
          
          <section className="mb-8 text-black">
            <h2 className="text-2xl font-bold mb-4">Conservazione dei dati</h2>
            <p>
              Conserviamo i tuoi dati personali solo per il tempo necessario al raggiungimento delle finalità per cui sono stati raccolti,
              inclusi gli obblighi di legge e fiscali, o per far valere i nostri diritti.
            </p>
          </section>
          
          <section className="mb-8 text-black">
            <h2 className="text-2xl font-bold mb-4">I tuoi diritti</h2>
            <p>
              Hai diversi diritti in relazione ai tuoi dati personali, tra cui:
            </p>
            <ul className="list-disc pl-5 mt-4 space-y-2">
              <li>Diritto di accesso ai tuoi dati</li>
              <li>Diritto di rettifica di dati inesatti</li>
              <li>Diritto alla cancellazione (diritto all'oblio)</li>
              <li>Diritto di limitazione del trattamento</li>
              <li>Diritto alla portabilità dei dati</li>
              <li>Diritto di opposizione al trattamento</li>
              <li>Diritto di revocare il consenso in qualsiasi momento</li>
            </ul>
            <p className="mt-4">
              Per esercitare questi diritti, contattaci all'indirizzo email: privacy@webzupp.com
            </p>
          </section>
          
          <section className="mb-8 text-black">
            <h2 className="text-2xl font-bold mb-4">Sicurezza dei dati</h2>
            <p>
              Adottiamo misure di sicurezza tecniche e organizzative appropriate per proteggere i tuoi dati personali
              da accessi non autorizzati, perdite accidentali o alterazioni.
            </p>
          </section>
          
          <section className="mb-8 text-black">
            <h2 className="text-2xl font-bold mb-4">Modifiche all'informativa</h2>
            <p>
              Possiamo aggiornare questa informativa sulla privacy di tanto in tanto per riflettere cambiamenti
              nelle nostre pratiche o per altri motivi operativi, legali o normativi. Ti invitiamo a rivedere
              periodicamente questa pagina per essere informato su eventuali modifiche.
            </p>
          </section>
          
          <section className="mb-8 text-black">
            <h2 className="text-2xl font-bold mb-4">Contattaci</h2>
            <p>
              Se hai domande su questa informativa sulla privacy o su come trattiamo i tuoi dati personali,
              contattaci all'indirizzo:
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