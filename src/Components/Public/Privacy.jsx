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

function Privacy() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-white">Aviso de Privacidad</h1>
        <p className="mb-10 text-sm text-slate-400">Última actualización: Julio 2026</p>

        <div className="space-y-10">
          <Section title="1. Identidad y domicilio del responsable">
            <p>UTVentas, plataforma de compraventa entre estudiantes de la Universidad Tecnológica (en adelante, "UTVentas"), con domicilio en las instalaciones del campus universitario, es el responsable del tratamiento de tus datos personales.</p>
          </Section>

          <Section title="2. Datos personales recabados">
            <p>Para las finalidades descritas en el presente aviso, recabamos los siguientes datos personales:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nombre completo</li>
              <li>Correo electrónico institucional (@utj.edu.mx)</li>
              <li>Número de teléfono de contacto</li>
              <li>Matrícula o identificación universitaria</li>
              <li>Información de perfil dentro de la plataforma</li>
              <li>Historial de transacciones y publicaciones</li>
            </ul>
          </Section>

          <Section title="3. Finalidades del tratamiento">
            <p>Los datos personales serán utilizados para las siguientes finalidades:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Creación y gestión de la cuenta de usuario</li>
              <li>Facilitar la publicación de productos y la comunicación entre compradores y vendedores</li>
              <li>Procesar pagos a través del sistema de Escrow</li>
              <li>Resolver disputas entre usuarios</li>
              <li>Enviar notificaciones relacionadas con la plataforma</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
            </ul>
          </Section>

          <Section title="4. Transferencia de datos personales">
            <p>Se informa que no se realizarán transferencias de datos personales a terceros nacionales o internacionales sin el consentimiento del titular, salvo las excepciones previstas en la legislación aplicable. Los datos de contacto entre comprador y vendedor son compartidos únicamente con la contraparte de una transacción activa.</p>
          </Section>

          <Section title="5. Derechos ARCO">
            <p>Como titular de los datos personales, tienes derecho a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Acceso:</strong> Conocer qué datos personales tenemos y cómo los tratamos</li>
              <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos o incompletos</li>
              <li><strong>Cancelación:</strong> Solicitar la eliminación de tus datos cuando ya no sean necesarios</li>
              <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos para fines específicos</li>
            </ul>
          </Section>

          <Section title="6. Medidas de seguridad">
            <p>UTVentas implementa medidas de seguridad administrativas, técnicas y físicas para proteger tus datos personales contra daño, pérdida, alteración, destrucción o uso indebido. Esto incluye cifrado de comunicaciones, almacenamiento seguro de contraseñas y controles de acceso.</p>
          </Section>

          <Section title="7. Cambios al aviso de privacidad">
            <p>Nos reservamos el derecho de modificar el presente aviso de privacidad en cualquier momento. Las modificaciones serán notificadas a través de la plataforma o por correo electrónico institucional.</p>
          </Section>
        </div>
      </div>
    </PublicLayout>
  )
}

export default Privacy
