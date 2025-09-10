"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Check, Sparkles, Instagram, MessageCircle } from "lucide-react"

type Step = "welcome" | "questionnaire" | "choice" | "contact" | "confirmation"

interface QuestionnaireData {
  question1: string
  question2: string
  question3: string
}

interface ContactData {
  name: string
  email: string
  phone: string
  gender: string
}

const questions = [
  {
    id: "question1",
    text: "¿Cuál es tu principal objetivo al considerar un tratamiento facial?",
    options: [
      "Reducir flacidez y papada",
      "Suavizar arrugas y líneas de expresión",
      "Mejorar la calidad general de la piel",
      "Definir el óvalo facial",
    ],
    feedback:
      "¡Excelente objetivo! El Endolifting es ideal para tratar la flacidez y redefinir el contorno facial desde adentro.",
  },
  {
    id: "question2",
    text: "¿En qué rango de edad te encuentras?",
    options: ["18-25 años", "26-35 años", "36-45 años", "46-55 años", "56-65 años", "Más de 65 años"],
    feedback:
      "Estás en la edad ideal donde la estimulación de colágeno con Endolifting puede dar los resultados más espectaculares.",
  },
  {
    id: "question3",
    text: "¿Has tenido algún tratamiento estético facial antes?",
    options: [
      "Sí, tratamientos inyectables (bótox, rellenos)",
      "Sí, aparatología (radiofrecuencia, ultrasonido)",
      "No, este sería mi primer tratamiento",
      "Sí, una cirugía facial",
    ],
    feedback:
      "Gracias por compartirlo. El Endolifting es compatible con muchos historiales y es una excelente opción tanto para principiantes como para expertas.",
  },
]

export default function EndoliftingLanding() {
  const [currentStep, setCurrentStep] = useState<Step>("welcome")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({
    question1: "",
    question2: "",
    question3: "",
  })
  const [contactData, setContactData] = useState<ContactData>({
    name: "",
    email: "",
    phone: "",
    gender: "",
  })
  const [showFeedback, setShowFeedback] = useState(false)

  const getProgressValue = () => {
    switch (currentStep) {
      case "welcome":
        return 0
      case "questionnaire":
        return 33 + (currentQuestion / questions.length) * 33
      case "choice":
        return 66
      case "contact":
        return 83
      case "confirmation":
        return 100
      default:
        return 0
    }
  }

  const handleQuestionAnswer = (answer: string) => {
    const questionKey = questions[currentQuestion].id as keyof QuestionnaireData
    setQuestionnaireData((prev) => ({ ...prev, [questionKey]: answer }))
    setShowFeedback(true)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setShowFeedback(false)
      } else {
        setCurrentStep("choice")
        setShowFeedback(false)
      }
    }, 2000)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (contactData.name && contactData.email && contactData.phone && contactData.gender) {
      try {
        const webhookData = {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          gender: contactData.gender,
          question1: questionnaireData.question1,
          question2: questionnaireData.question2,
          question3: questionnaireData.question3,
        }

        await fetch("https://n8n-n8n.zkl5zb.easypanel.host/webhook/e5817544-cdaf-4e59-a870-fed4341836ee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(webhookData),
        })
      } catch (error) {
        console.log("[v0] Webhook error:", error)
        // Continue to confirmation even if webhook fails
      }

      setCurrentStep("confirmation")
    }
  }

  const scrollToQuestionnaire = () => {
    setTimeout(() => {
      const questionnaireElement = document.getElementById("questionnaire-section")
      if (questionnaireElement) {
        questionnaireElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        })
      }
    }, 100)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -60 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  const slideInLeft = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  }

  const slideInRight = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/marble-background.webp')",
          }}
        />

        <motion.div
          className="absolute inset-0 bg-black/40"
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Progress Bar */}
      <AnimatePresence>
        {currentStep !== "welcome" && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-50 p-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl mx-auto">
              <Progress value={getProgressValue()} className="h-2" />
              <motion.div
                className="flex justify-between text-xs text-white mt-2"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.span variants={fadeInUp}>Introducción</motion.span>
                <motion.span variants={fadeInUp}>Cuestionario</motion.span>
                <motion.span variants={fadeInUp}>Contacto</motion.span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {currentStep === "welcome" && (
              <motion.div
                key="welcome"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  {/* Video Section */}
                  <motion.div
                    className="order-2 lg:order-1"
                    variants={slideInLeft}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <Card className="glass-panel border-0">
                      <CardContent className="p-6">
                        <motion.div
                          className="aspect-[9/16] max-w-sm mx-auto"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          <iframe
                            src="https://www.instagram.com/p/DODyt7MDt8S/embed"
                            className="w-full h-full rounded-lg"
                            frameBorder="0"
                            scrolling="no"
                          />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Content Section */}
                  <motion.div
                    className="order-1 lg:order-2 space-y-6 flex items-center"
                    variants={slideInRight}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10">
                      <div className="text-center lg:text-left">
                        <motion.h1
                          className="font-playfair text-3xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg text-balance"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.6 }}
                        >
                          Rejuvenece Sin Cirugía con <span className="text-primary">Endolifting Láser</span>
                        </motion.h1>

                        <motion.div
                          className="border-l-4 border-primary pl-4 mb-6"
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.8 }}
                        >
                          <p className="text-white/90 text-base lg:text-lg leading-relaxed drop-shadow-md">
                            Hola, soy la Dra. Isaura Dorado, especialista en medicina estética en Riohacha. En mis 15
                            años de experiencia he ayudado a más de 500 mujeres a rejuvenecer sin cirugía.
                          </p>
                        </motion.div>

                        <motion.p
                          className="text-white text-lg lg:text-xl mb-8 drop-shadow-md"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6, delay: 1.0 }}
                        >
                          ¿Te da miedo la cirugía pero quieres resultados reales? Descubre en 3 minutos si eres la
                          candidat@ perfecta para mi técnica.
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 1.2 }}
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.05, 1],
                              rotate: [0, 1, -1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                          >
                            <Button
                              size="lg"
                              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden w-full sm:w-auto"
                              onClick={scrollToQuestionnaire}
                              style={{
                                boxShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
                              }}
                            >
                              <motion.div
                                className="absolute inset-0 border-2 border-yellow-400 rounded-lg"
                                animate={{
                                  opacity: [0, 0.8, 0],
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "easeInOut",
                                }}
                              />
                              <span className="relative z-10">Descubre si eres candidat@</span>
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  id="questionnaire-section"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                >
                  <Card className="glass-panel border-0 max-w-2xl mx-auto">
                    <CardContent className="p-6 lg:p-8">
                      <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-800 mb-4 text-balance">
                          Con solo 3 preguntas sabemos si eres candidata - Recibe tu consultoría gratis y aparta tu 60%
                          de descuento
                        </h2>
                        <p className="text-gray-700 text-base lg:text-lg">
                          Pregunta {currentQuestion + 1} de {questions.length}
                        </p>
                        {questions[currentQuestion] && (
                          <p className="text-gray-700 text-base lg:text-lg mt-2">{questions[currentQuestion].text}</p>
                        )}
                      </motion.div>

                      <AnimatePresence mode="wait">
                        {!showFeedback ? (
                          <motion.div
                            key="options"
                            className="space-y-3 lg:space-y-4"
                            variants={staggerContainer}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                          >
                            {questions[currentQuestion]?.options?.map((option, index) => (
                              <motion.div
                                key={index}
                                variants={fadeInUp}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                              >
                                <Button
                                  variant="outline"
                                  className="w-full p-3 lg:p-4 text-left justify-start bg-white/80 border-gray-300 text-gray-800 hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] text-sm lg:text-base leading-tight break-words whitespace-normal min-h-[3rem] h-auto"
                                  onClick={() => handleQuestionAnswer(option)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <span className="text-left break-words">{option}</span>
                                </Button>
                              </motion.div>
                            ))}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="feedback"
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                          >
                            <div className="mb-6">
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                              >
                                <Check className="h-12 lg:h-16 w-12 lg:w-16 text-primary mx-auto mb-4" />
                              </motion.div>
                              {questions[currentQuestion]?.feedback && (
                                <motion.p
                                  className="text-gray-700 text-base lg:text-lg"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                  {questions[currentQuestion].feedback}
                                </motion.p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Testimonials */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.6 }}
                >
                  <Card className="glass-panel border-0">
                    <CardContent className="p-6 lg:p-8">
                      <motion.h2
                        className="font-playfair text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.8 }}
                      >
                        Lo que dicen mis pacientes
                      </motion.h2>
                      <motion.div
                        className="grid md:grid-cols-2 gap-6 mb-8"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        <motion.div
                          className="text-center"
                          variants={fadeInUp}
                          transition={{ duration: 0.6, delay: 2.0 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <p className="text-gray-700 text-base lg:text-lg italic mb-4">
                            "La Dra. Isaura cambió mi vida sin bisturí. El resultado es increíble y súper natural."
                          </p>
                          <p className="text-primary font-semibold">- Ana R., 52 años</p>
                        </motion.div>
                        <motion.div
                          className="text-center"
                          variants={fadeInUp}
                          transition={{ duration: 0.6, delay: 2.2 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <p className="text-gray-700 text-base lg:text-lg italic mb-4">
                            "Tenía pánico a la cirugía. Con la Dra. encontré la solución perfecta. ¡Gracias!"
                          </p>
                          <p className="text-primary font-semibold">- María F., 48 años</p>
                        </motion.div>
                      </motion.div>

                      <motion.div
                        className="grid md:grid-cols-2 gap-4"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                      >
                        <motion.div
                          className="overflow-hidden rounded-lg shadow-md"
                          variants={fadeInUp}
                          transition={{ duration: 0.6, delay: 2.4 }}
                          whileHover={{ scale: 1.03 }}
                        >
                          <iframe
                            src="https://www.instagram.com/p/DH_iXpjOP4P/embed"
                            className="w-full min-h-[400px] lg:min-h-[500px] rounded-lg"
                            frameBorder="0"
                            scrolling="no"
                          />
                        </motion.div>
                        <motion.div
                          className="overflow-hidden rounded-lg shadow-md"
                          variants={fadeInUp}
                          transition={{ duration: 0.6, delay: 2.6 }}
                          whileHover={{ scale: 1.03 }}
                        >
                          <iframe
                            src="https://www.instagram.com/p/C_0_eyGSSk8/embed"
                            className="w-full min-h-[400px] lg:min-h-[500px] rounded-lg"
                            frameBorder="0"
                            scrolling="no"
                          />
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* FAQ */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 2.8 }}
                >
                  <Card className="glass-panel border-0">
                    <CardContent className="p-6 lg:p-8">
                      <motion.h2
                        className="font-playfair text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 3.0 }}
                      >
                        Resolvemos tus dudas
                      </motion.h2>
                      <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
                        {[
                          {
                            question: "¿Duele el Endolifting?",
                            answer:
                              "Se utiliza anestesia local para minimizar cualquier molestia. La mayoría de mis pacientes lo describen como un procedimiento muy tolerable.",
                          },
                          {
                            question: "¿Cuánto dura la recuperación?",
                            answer:
                              "La recuperación es mínima. Puedes retomar tus actividades diarias casi de inmediato, a diferencia de los largos periodos de una cirugía.",
                          },
                          {
                            question: "¿Es seguro vs cirugía tradicional?",
                            answer:
                              "Absolutamente. Al ser mínimamente invasivo, los riesgos asociados a una cirugía mayor, como la anestesia general y las cicatrices, se eliminan.",
                          },
                        ].map((faq, index) => (
                          <motion.div
                            key={index}
                            variants={fadeInUp}
                            transition={{ duration: 0.5, delay: 3.2 + index * 0.1 }}
                          >
                            <Collapsible>
                              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left text-gray-800 hover:bg-white/10 rounded-lg transition-colors">
                                <span className="font-semibold text-sm lg:text-base">{faq.question}</span>
                                <ChevronDown className="h-5 w-5 flex-shrink-0" />
                              </CollapsibleTrigger>
                              <CollapsibleContent className="px-4 pb-4 text-gray-700 text-sm lg:text-base">
                                {faq.answer}
                              </CollapsibleContent>
                            </Collapsible>
                          </motion.div>
                        ))}
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Choice Step */}
            {currentStep === "choice" && (
              <motion.div
                key="choice"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6 }}
              >
                <Card className="glass-panel border-0 max-w-3xl mx-auto">
                  <CardContent className="p-6 lg:p-8">
                    <motion.div
                      className="text-center mb-8"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                        ¡Excelente! Has completado la primera parte.
                      </h2>
                      <p className="text-gray-700 text-base lg:text-lg">
                        Ahora tienes dos caminos para continuar. Elige el que prefieras.
                      </p>
                    </motion.div>

                    <motion.div
                      className="grid md:grid-cols-2 gap-6"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      <motion.div
                        variants={slideInLeft}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <Card className="bg-primary/20 border-primary h-full">
                          <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                            <div>
                              <h3 className="font-playfair text-xl lg:text-2xl font-bold text-primary mb-4">
                                NIVEL PREMIUM
                              </h3>
                              <p className="text-gray-800 mb-6 text-sm lg:text-base">
                                Accede a una consulta virtual GRATIS de 10 minutos directamente conmigo y asegura tu
                                descuento de preventa.
                              </p>
                            </div>
                            <Button
                              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold flex items-center justify-center gap-2 transform transition-all duration-300 hover:scale-105 text-sm lg:text-base py-3"
                              onClick={() => setCurrentStep("contact")}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                              <span>CONSULTA GRATUITA</span>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        variants={slideInRight}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <Card className="bg-gradient-to-br from-pink-500 to-rose-400 border-pink-400 shadow-lg h-full">
                          <CardContent className="p-6 text-center h-full flex flex-col justify-between">
                            <div>
                              <h3 className="font-playfair text-xl lg:text-2xl font-bold text-white mb-4">
                                NIVEL BÁSICO
                              </h3>
                              <p className="text-white/95 mb-6 font-medium text-sm lg:text-base">
                                Recibe guías, consejos y mantente al día de todas las novedades siguiéndome en mi perfil
                                de Instagram.
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              className="w-full border-2 border-white text-white hover:bg-white hover:text-pink-500 bg-transparent font-semibold transition-all duration-300 shadow-md hover:shadow-lg px-4 py-3 flex items-center justify-center gap-2 text-sm lg:text-base"
                              onClick={() => window.open("https://www.instagram.com/rostrodoradoclinic/", "_blank")}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Instagram className="h-4 w-4 lg:h-5 lg:w-5" />
                              <span>SÍGUEME EN INSTAGRAM</span>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Contact Step */}
            {currentStep === "contact" && (
              <motion.div
                key="contact"
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
              >
                <Card className="glass-panel border-0 max-w-2xl mx-auto">
                  <CardContent className="p-6 lg:p-8">
                    <motion.div
                      className="text-center mb-8"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                        ¡Estás a un paso de tu evaluación personalizada!
                      </h2>
                      <p className="text-gray-700 text-base lg:text-lg">
                        Para asegurar tu cupo de preventa y coordinar tu consulta gratuita, déjame tus datos.
                      </p>
                    </motion.div>

                    <motion.form
                      onSubmit={handleContactSubmit}
                      className="space-y-6"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      <motion.div variants={fadeInUp} transition={{ duration: 0.5, delay: 0.2 }}>
                        <Label htmlFor="name" className="text-gray-800 font-semibold text-sm lg:text-base">
                          ¿Cuál es tu nombre completo?
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={contactData.name}
                          onChange={(e) => setContactData((prev) => ({ ...prev, name: e.target.value }))}
                          className="mt-2 bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:bg-white focus:border-primary transition-all duration-300"
                          placeholder="Tu nombre completo"
                          required
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp} transition={{ duration: 0.5, delay: 0.3 }}>
                        <Label htmlFor="email" className="text-gray-800 font-semibold text-sm lg:text-base">
                          ¿Cuál es tu correo electrónico?
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactData.email}
                          onChange={(e) => setContactData((prev) => ({ ...prev, email: e.target.value }))}
                          className="mt-2 bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:bg-white focus:border-primary transition-all duration-300"
                          placeholder="tu@email.com"
                          required
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp} transition={{ duration: 0.5, delay: 0.4 }}>
                        <Label htmlFor="phone" className="text-gray-800 font-semibold text-sm lg:text-base">
                          ¿A qué número de WhatsApp te contacto?
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={contactData.phone}
                          onChange={(e) => setContactData((prev) => ({ ...prev, phone: e.target.value }))}
                          className="mt-2 bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:bg-white focus:border-primary transition-all duration-300"
                          placeholder="+57 300 123 4567"
                          required
                        />
                      </motion.div>

                      <motion.div variants={fadeInUp} transition={{ duration: 0.5, delay: 0.5 }}>
                        <Label className="text-gray-800 font-semibold mb-3 block text-sm lg:text-base">
                          ¿Cuál es tu género?
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            type="button"
                            variant={contactData.gender === "Femenino" ? "default" : "outline"}
                            className={`p-3 lg:p-4 text-sm lg:text-base ${
                              contactData.gender === "Femenino"
                                ? "bg-primary text-white"
                                : "bg-white/90 border-gray-300 text-gray-800 hover:bg-primary hover:text-white"
                            } transition-all duration-300`}
                            onClick={() => setContactData((prev) => ({ ...prev, gender: "Femenino" }))}
                          >
                            Femenino
                          </Button>
                          <Button
                            type="button"
                            variant={contactData.gender === "Masculino" ? "default" : "outline"}
                            className={`p-3 lg:p-4 text-sm lg:text-base ${
                              contactData.gender === "Masculino"
                                ? "bg-primary text-white"
                                : "bg-white/90 border-gray-300 text-gray-800 hover:bg-primary hover:text-white"
                            } transition-all duration-300`}
                            onClick={() => setContactData((prev) => ({ ...prev, gender: "Masculino" }))}
                          >
                            Masculino
                          </Button>
                        </div>
                      </motion.div>

                      <motion.div variants={fadeInUp} transition={{ duration: 0.5, delay: 0.6 }}>
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 lg:py-4 text-sm lg:text-base leading-tight transform transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[3rem] h-auto whitespace-normal break-words"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-center break-words px-2">Quiero que la Dra. Isaura evalúe mi caso</span>
                        </Button>
                      </motion.div>
                    </motion.form>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Confirmation Step */}
            {currentStep === "confirmation" && (
              <motion.div
                key="confirmation"
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6 }}
              >
                <Card className="glass-panel border-0 max-w-2xl mx-auto">
                  <CardContent className="p-6 lg:p-8 text-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                    >
                      <Sparkles className="h-12 lg:h-16 w-12 lg:w-16 text-primary mx-auto mb-6" />
                    </motion.div>

                    <motion.h2
                      className="font-playfair text-2xl lg:text-3xl font-bold text-gray-800 mb-4"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      ¡Perfecto, {contactData.name}! Tus datos han sido recibidos
                    </motion.h2>

                    <motion.p
                      className="text-gray-700 text-base lg:text-lg mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      Basándome en tus respuestas, eres una excelente candidat@ para el Endolifting. He reservado tu
                      lugar y tu descuento especial.
                    </motion.p>

                    <motion.div
                      className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-6 mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.7 }}
                    >
                      <h3 className="font-playfair text-xl font-bold text-gray-800 mb-4">
                        🎉 Tus beneficios asegurados:
                      </h3>
                      <div className="space-y-3 text-left">
                        <div className="flex items-center text-gray-700">
                          <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span className="font-semibold">Consulta de Valoración GRATIS</span>
                          <span className="text-sm text-gray-600 ml-2">(valorada en $200.000 COP)</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span className="font-semibold">60% de Descuento Exclusivo</span>
                          <span className="text-sm text-gray-600 ml-2">en tu tratamiento de Endolifting</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span className="font-semibold">Evaluación personalizada</span>
                          <span className="text-sm text-gray-600 ml-2">basada en tus respuestas</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                    >
                      <p className="text-red-700 font-bold text-base lg:text-lg">
                        ⚡ ¡Solo quedan 12 espacios en preventa con 60% OFF!
                      </p>
                      <p className="text-red-600 text-sm mt-1">
                        No pierdas tu lugar, agenda ahora tu consulta gratuita
                      </p>
                    </motion.div>

                    <motion.div
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.1 }}
                    >
                      <h4 className="font-semibold text-blue-800 mb-2">📱 Siguiente paso:</h4>
                      <p className="text-blue-700 text-sm">
                        Te conectaré directamente con mi WhatsApp para coordinar tu consulta gratuita. Recibirás un
                        mensaje con todos tus datos y podremos agendar tu cita de inmediato.
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.3 }}
                    >
                      <Button
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 lg:py-5 text-base lg:text-lg leading-tight transform transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 min-h-[3.5rem] h-auto whitespace-normal break-words mb-4"
                        onClick={() => {
                          const questionsAnswered = Object.entries(questionnaireData)
                            .map(([key, value], index) => {
                              const question = questions[index]
                              return `${index + 1}. ${question?.text}: ${value}`
                            })
                            .join("\n")

                          const message = `Hola Dra. Isaura,

Mi nombre es ${contactData.name} y completé el cuestionario de Endolifting.

*MIS DATOS:*
Nombre: ${contactData.name}
Email: ${contactData.email}
WhatsApp: ${contactData.phone}
Género: ${contactData.gender}

*MIS RESPUESTAS AL CUESTIONARIO:*
${questionsAnswered}

Quiero agendar mi consulta gratuita y asegurar mi 60% de descuento en el tratamiento de Endolifting.

¡Gracias!`

                          const encodedMessage = encodeURIComponent(message)
                          window.open(
                            `https://api.whatsapp.com/send/?phone=573126196527&text=${encodedMessage}&type=phone_number&app_absent=0`,
                            "_blank",
                          )
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageCircle className="h-5 lg:h-6 w-5 lg:w-6 flex-shrink-0" />
                        <span className="text-center break-words">CONTINUAR A WHATSAPP - AGENDAR CONSULTA</span>
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.5 }}
                    >
                      <p className="text-gray-600 text-sm mb-3">¿Prefieres otro método de contacto?</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
                        onClick={() =>
                          window.open(
                            `mailto:isauradorado@gmail.com?subject=Consulta Endolifting - ${contactData.name}&body=Hola Dra. Isaura, completé el cuestionario y me gustaría agendar mi consulta gratuita.`,
                            "_blank",
                          )
                        }
                      >
                        📧 Contactar por Email
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        className="relative z-10 text-center py-6 text-white/60 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.4 }}
      >
        <p className="text-sm lg:text-base">Dra. Isaura Dorado - Rostros Dorado - Medicina Estética</p>
      </motion.footer>
    </div>
  )
}
