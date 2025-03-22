const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.blogPost.create({
    data: {
      title: 'Welcome to SME',
      slug: 'welcome-to-sme',
      content: 'This is a test post.',
      publishedAt: new Date(),
      status: 'published',
    },
  });

  await prisma.stat.createMany({
    data: [
      { label: "Alianzas Nacionales e Internacionales", value: 94 },
      { label: "Personas alcanzadas", value: 1424371 },
      { label: "Chats en vivo de PAP", value: 7751 },
    ],
  });

  await prisma.aboutSection.createMany({
    data: [
      {
        title: "Acerca de SME",
        content:
          "La Fundación Salud Mental Ecuador, ganadora del Reconocimiento Quito Sostenible e Inclusivo 2022, fue creada en tiempos de pandemia en julio del 2020 con la intención de ofrecer un servicio de atención en salud mental de calidad a la comunidad.",
        order: 1,
        slug: "acerca",
      },
      {
        title: "Misión",
        content:
          "Mejorar la salud mental en todo el Ecuador mediante servicios gratuitos y de bajo costo.",
        order: 2,
        slug: "mision",
      },
      {
        title: "Visión",
        content:
          "Un Ecuador que valore la salud mental al mismo nivel que la salud física, eliminando así los estigmas asociados con el cuidado de esta y fomentando la implementación del bienestar mental en todas las instituciones del país.",
        order: 3,
        slug: "vision",
      },
    ],
  });

  await prisma.service.createMany({
    data: [
      {
        title: "Terapias virtuales",
        description: "Accede a terapia profesional desde cualquier lugar a bajo costo.",
        featured: true,
      },
      {
        title: "Primeros Auxilios Psicológicos",
        description: "Chat en vivo con profesionales para orientación inmediata.",
        featured: true,
      },
      {
        title: "Talleres y grupos de apoyo",
        description: "Participa en espacios seguros para aprender, compartir y sanar.",
        featured: true,
      },
    ],
  });

  await prisma.timelineEvent.createMany({
    data: [
      { year: "2020", event: "Creación de la Fundación Salud Mental Ecuador (SME)", order: 1 },
      { year: "2020", event: "Programas semanales sobre salud mental en El As y La Pluma", order: 2 },
      { year: "2021", event: "Primer artículo publicado en la revista VIVE LIGHT", order: 3 },
      { year: "2021", event: "Conferencistas para convocatorias de ley en la Asamblea Nacional", order: 4 },
      { year: "2022", event: "Conferencistas en el primer evento del año de Impaqto", order: 5 },
      { year: "2022", event: "Ganadores del Reconocimiento Quito Sostenible e Inclusivo 2022 de CONQUITO", order: 6 },
      { year: "2022", event: "Únicos conferencistas y participantes de salud mental en el evento de tecnologías médicas 2022 (TECHMED 2022)", order: 7 },
      { year: "2023", event: "77,500 personas alcanzadas con nuestras campañas por el mes de la salud mental", order: 8 },
      { year: "2023", event: "Taller al Tribunal Contencioso Electoral (TCE) en consecuencia a la muerte cruzada de Guillermo Lasso", order: 9 },
      { year: "2023", event: "Creación del primer turismo comunitario con salud mental en Chilla Grande, Cotopaxi", order: 10 },
      { year: "2023", event: "Primera entrevista de radio (Radio Élite)", order: 11 },
      { year: "2023", event: "Mérito Emprendimiento Social Telesucesos", order: 12 },
      { year: "2023", event: "Transmisión en Teleamazonas (Te Veo Ecuador)", order: 13 },
      { year: "2024", event: "Evento Anual", order: 14 },
    ],
  });
}

main()
  .then(() => console.log("Seeding complete"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());