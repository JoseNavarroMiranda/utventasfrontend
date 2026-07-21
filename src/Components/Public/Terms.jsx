import { Link } from 'react-router'
import PublicLayout from './components/PublicLayout'

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="text-sm leading-7 text-slate-300 space-y-2">
        {children}
      </div>
    </div>
  )
}

function Terms() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-white">Términos de Servicio</h1>
        <p className="mb-10 text-sm text-slate-400">Última actualización: Julio 2026</p>

        <div className="space-y-10">
          <Section title="1. Aceptación de los términos">
            <p>Al registrarte y utilizar la plataforma UTVentas, aceptas cumplir con los presentes Términos de Servicio. Si no estás de acuerdo con alguno de estos términos, no podrás utilizar la plataforma.</p>
          </Section>

          <Section title="2. Elegibilidad">
            <p>Para utilizar UTVentas debes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ser estudiante activo de la Universidad Tecnológica con correo institucional @utj.edu.mx</li>
              <li>Tener al menos 18 años de edad, o contar con autorización de un tutor legal</li>
              <li>Proporcionar información verídica y actualizada</li>
              <li>No tener restricciones legales para realizar transacciones comerciales</li>
            </ul>
          </Section>

          <Section title="3. Responsabilidades del usuario">
            <p>Como usuario de UTVentas, te comprometes a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Publicar únicamente productos y servicios lícitos que cumplan con la normativa universitaria</li>
              <li>No publicar contenido falso, engañoso o que infrinja derechos de terceros</li>
              <li>Cumplir con los acuerdos de compraventa realizados a través de la plataforma</li>
              <li>No utilizar la plataforma para actividades fraudulentas o ilícitas</li>
              <li>Mantener la confidencialidad de tu cuenta y contraseña</li>
              <li>Notificar inmediatamente cualquier uso no autorizado de tu cuenta</li>
            </ul>
          </Section>

          <Section title="4. Sistema de Escrow">
            <p>UTVentas opera un sistema de Escrow para transacciones protegidas:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>El comprador realiza el pago del producto, el cual es retenido por la plataforma</li>
              <li>El vendedor entrega el producto en el campus universitario</li>
              <li>El comprador confirma la recepción mediante un token de entrega único</li>
              <li>Una vez confirmada la entrega, los fondos son liberados al vendedor</li>
              <li>En caso de disputa, la plataforma retendrá los fondos hasta la resolución</li>
            </ul>
          </Section>

          <Section title="5. Prohibiciones">
            <p>Está estrictamente prohibido:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Publicar productos ilegales, armas, drogas, alcohol, tabaco o contenido explícito</li>
              <li>Suplantar la identidad de otros usuarios</li>
              <li>Manipular precios, puntuaciones o reseñas de forma fraudulenta</li>
              <li>Realizar transacciones fuera de la plataforma para evadir las comisiones o el sistema de Escrow</li>
              <li>Publicar información personal de terceros sin su consentimiento</li>
            </ul>
          </Section>

          <Section title="6. Limitación de responsabilidad">
            <p>UTVentas actúa únicamente como intermediario entre compradores y vendedores. La plataforma no se hace responsable por:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>La calidad, seguridad o legalidad de los productos publicados</li>
              <li>La veracidad de las descripciones de los productos</li>
              <li>La conducta de los usuarios dentro o fuera de la plataforma</li>
              <li>Daños derivados de transacciones entre usuarios</li>
            </ul>
            <p>UTVentas facilitará la resolución de disputas, pero no garantiza un resultado favorable para ninguna de las partes.</p>
          </Section>

          <Section title="7. Suspensión y cancelación de cuentas">
            <p>UTVentas se reserva el derecho de suspender o cancelar cuentas que violen estos términos, incluyendo pero no limitado a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Actividades fraudulentas o engañosas</li>
              <li>Incumplimiento reiterado de acuerdos de compraventa</li>
              <li>Publicación de contenido prohibido</li>
              <li>Conducta abusiva hacia otros usuarios o el equipo de la plataforma</li>
            </ul>
          </Section>

          <Section title="8. Modificaciones">
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a los usuarios a través de la plataforma o por correo electrónico. El uso continuado de la plataforma después de las modificaciones constituye la aceptación de los nuevos términos.</p>
          </Section>

          <Section title="9. Contacto">
            <p>Para cualquier duda, aclaración o reporte relacionado con estos términos, puedes contactarnos a través de la plataforma o mediante el correo institucional de la universidad.</p>
          </Section>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Terms
