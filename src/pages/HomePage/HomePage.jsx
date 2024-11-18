import { useEffect, useState } from 'react'
import { Head } from "../../components/Components/Head";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [state, setState] = useState(false)

    // Replace javascript:void(0) paths with your paths
    const navigation = [
        { title: "INICIO", path: "/" },
        { title: "ACERCA DE", path: "/" },
        { title: "CONTACTO", path: "/" }
    ]

    useEffect(() => {
        const handleClick = (e) => {
            const target = e.target;
            if (!target.closest(".menu-btn")) setState(false);
        };

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);


    const Brand = () => (
        <div className="flex items-center justify-between py-5 md:block">
            <a href="/">
                <img
                    src="/Logo_IMG.jpg"
                    width={120}
                    height={50}
                    alt="HOME PAGE logo"
                />
            </a>
            <div className="md:hidden">
                <button className="menu-btn text-gray-500 hover:text-gray-800"
                    onClick={() => setState(!state)}
                >
                    {
                        state ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )
                    }
                </button>
            </div>
        </div>
    )

    return (
        <>
            <Head
                newtitle="Inicio"
                newdescription="Explora y gestiona tus bitácoras de campo de manera eficiente desde una sola plataforma."
                newkeywords="bitácoras, gestión de campo, plataforma de bitácoras, inicio"
            />

            <div className='relative'>
                <div className='absolute inset-0 blur-xl h-[580px]' style={{ background: "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)" }}></div>
                <div className='relative'>
                    <header>
                        <div className={`md:hidden ${state ? "mx-2 pb-5" : "hidden"}`}>
                            <Brand />
                        </div>
                        <nav className={`pb-5 md:text-sm ${state ? "absolute top-0 inset-x-0 bg-white shadow-lg rounded-xl border mx-2 mt-2 md:shadow-none md:border-none md:mx-0 md:mt-0 md:relative md:bg-transparent" : ""}`}>
                            <div className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8">
                                <Brand />
                                <div className={`flex-1 items-center mt-8 md:mt-0 md:flex ${state ? 'block' : 'hidden'} `}>
                                    <ul className="flex-1 justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
                                        {
                                            navigation.map((item, idx) => {
                                                return (
                                                    <li key={idx} className="text-gray-700 hover:text-gray-900">
                                                        <a href={item.path} className="block">
                                                            {item.title}
                                                        </a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    <div className="items-center justify-end mt-6 space-y-6 md:flex md:mt-0">
                                        <Link to={"/login"} >
                                            <a href="javascript:void(0)" className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                                                Inciar Sesión
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </header>
                    <section>
                        <div className="max-w-screen-xl mx-auto px-4 py-28 gap-12 text-gray-600 overflow-hidden md:px-8 md:flex">
                            <div className='flex-none space-y-5 max-w-xl'>
                                <h1 className="text-4xl text-gray-800 font-extrabold sm:text-5xl">
                                    Bitácora Botánica de Campo
                                </h1>
                                <p>
                                    Diseñada para registrar, organizar y explorar muestreos botánicos. Aquí, investigadores y colaboradores pueden documentar especies, compartir hallazgos y analizar datos de campo de manera eficiente. Desde la creación de bitácoras detalladas hasta la visualización geográfica de muestras, esta herramienta facilita la gestión de investigaciones botánicas de forma segura y colaborativa.
                                </p>
                                <div className='flex items-center gap-x-3 sm:text-sm'>
                                    <a
                                        href="/login"
                                        className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                                        Inciar Sesión
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path
                                                fillRule="evenodd"
                                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>

                                </div>
                            </div>
                            <div className='flex-1 hidden md:block'>
                                <img src="/Logo_IMG.jpg" className="max-w-xl" />
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="max-w-screen-xl mx-auto px-4 py-16 gap-12 text-gray-600 overflow-hidden md:px-8 md:flex">
                            <div className='flex-none space-y-5 max-w-xl'>
                                <h1 className="text-4xl text-gray-800 font-extrabold sm:text-5xl">
                                    Conoce Nuestra Bitácora Botánica
                                </h1>
                                <p>
                                    Nuestra plataforma está diseñada para apoyar a los investigadores y estudiantes en el registro, análisis y difusión de datos botánicos. Permite documentar muestras de campo, identificar especies, y colaborar en investigaciones sobre la biodiversidad, todo de manera sencilla y accesible.
                                </p>
                            </div>
                            <div className="flex-none space-y-5 max-w-xl">
                                <h2 className="text-4xl text-gray-800 font-extrabold sm:text-5xl">
                                    Propósito:
                                </h2>
                                <p className="text-gray-700 mt-2">
                                    "El objetivo principal es proporcionar una herramienta eficiente para registrar datos botánicos, facilitando el análisis
                                    científico y promoviendo la conservación de los ecosistemas. Aquí, cada herramienta contribuye al conocimiento
                                    colectivo sobre la flora local y global."
                                </p>
                            </div>
                        </div>
                        <div className="max-w-screen-xl mx-auto px-4 py-7 gap-12 text-gray-600 overflow-hidden md:px-8 md:flex">
                            <div className='flex-none space-y-5 max-w-xl'>
                                <h2 className="text-3xl text-gray-800 font-extrabold sm:text-4xl">
                                    ¿Qué es una Bitácora Botánica?
                                </h2>
                                <p className="text-gray-700 mt-2">
                                    Una bitácora botánica es un registro detallado y sistemático de las especies vegetales observadas en un área determinada. En nuestra plataforma, no solo podrás registrar cada observación, sino también adjuntar fotografías, realizar anotaciones sobre el hábitat, condiciones climáticas y otros datos relevantes que facilitarán su análisis y la creación de bases de datos sobre la biodiversidad.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className="max-w-screen-xl mx-auto px-4 py-16 gap-12 text-gray-600 overflow-hidden md:px-8 md:flex">
                            <div className="flex-none space-y-5 max-w-xl">
                                <h2 className="text-3xl text-gray-800 font-extrabold sm:text-4xl">
                                    CONTACTENOS
                                </h2>
                                <p className="text-gray-700 mt-2">
                                    Si tienes alguna duda o sugerencia, no dudes en ponerte en contacto con nosotros. ¡Estamos aquí para ayudarte!
                                </p>

                                <form action="#" method="POST" className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tu Nombre</label>
                                        <input type="text" id="name" name="name" className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Tu Correo Electrónico</label>
                                        <input type="email" id="email" name="email" className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Tu Mensaje</label>
                                        <textarea id="message" name="message" rows="4" className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required></textarea>
                                    </div>
                                    <div>
                                        <button type="submit" className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                                            Enviar Mensaje
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="flex space-x-8 mt-8">
                                <div className="flex-none w-1/2">
                                    <img src="/JanerMuñoz.png" alt="ImagenJaner" className="w-full h-auto object-cover rounded-lg" />
                                    <p className="text-center text-lg font-medium mt-2">Janer Fabian Muñoz</p>
                                </div>
                                <div className="flex-none w-1/2">
                                    <img src="/DivaVargas.jpg" alt="ImagenDiva" className="w-full h-auto object-cover rounded-lg" />
                                    <p className="text-center text-lg font-medium mt-2">Diva Vargas Tovar</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}

export default HomePage