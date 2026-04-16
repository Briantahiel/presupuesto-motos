"use client";
import { useState, useEffect } from "react";
import "./globals.css";
import { CreditCard, Percent, FileText, Landmark, Wallet, RotateCcw, TrendingDown } from "lucide-react";

type Presupuesto = {
  porcentaje: string;
  formulario200k: number;
  totalFormularios: number;
  runa: number;
};

export default function Home() {
  const [valor, setValor] = useState("");
  const [data, setData] = useState<Presupuesto | null>(null);
  const [modelo, setModelo] = useState("");
  const [tipoPago, setTipoPago] = useState<"contado" | "credito" | "tarjeta">("contado");
  const [descuento, setDescuento] = useState("");
  const [cuotas, setCuotas] = useState("");
  const [recargo, setRecargo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
const [instalable, setInstalable] = useState(false);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const monto = parseFloat(valor) || 0;
const desc = parseFloat(descuento) || 0;

const ahorro = tipoPago === "contado"
  ? Math.round((monto * desc) / 100)
  : 0;
  const quitarEmojis = (texto: string) => {
  return texto.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
};


  const [copiado, setCopiado] = useState(false);
  const deshabilitado = tipoPago === "tarjeta" && !cuotas;

  const format = (num: number) => num.toLocaleString("es-AR");
  const resetear = () => {
  setValor("");
  setDescuento("");
  setCuotas("");
  setRecargo("");
  setTipoPago("contado");
  setData(null);
};

useEffect(() => {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone;

  if (isStandalone) {
    setInstalable(false);
  }
}, []);
  useEffect(() => {
    const { precioFinal } = calcularFinal();

    if (!precioFinal || isNaN(precioFinal)) {
      setData(null);
      return;
    }

    setData(crearPresupuesto(precioFinal));
  }, [valor, descuento, recargo, tipoPago, cuotas]);
  useEffect(() => {
  const handler = (e: any) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setInstalable(true);
  };

  window.addEventListener("beforeinstallprompt", handler);

  return () => window.removeEventListener("beforeinstallprompt", handler);
}, []);

  const crearPresupuesto = (valorFC: number): Presupuesto => {
    const porcentaje = Math.abs(((0.03 * valorFC) / 200000) * 100 - 100);
    const formulario200k = 200000 - (200000 * porcentaje) / 100;
    const totalFormularios = formulario200k + 18800;
    const runa = valorFC * 0.008;

    return {
      porcentaje: porcentaje.toFixed(2),
      formulario200k: Math.round(formulario200k),
      totalFormularios: Math.round(totalFormularios),
      runa: Math.round(runa),
    };
  };

  const calcularFinal = () => {
    const monto = parseFloat(valor) || 0;
    const desc = parseFloat(descuento) || 0;
    const cant = parseInt(cuotas) || 0;
    const rec = parseFloat(recargo) || 0;

    let precioFinal = monto;
    let cuotaCalculada = 0;

    if (tipoPago === "contado") {
      precioFinal = monto - (monto * desc) / 100;
    }

    if (tipoPago === "tarjeta") {
      const totalConRecargo = monto + (monto * rec) / 100;
      precioFinal = totalConRecargo;
      cuotaCalculada = cant > 0 ? totalConRecargo / cant : 0;
    }

    return {
      precioFinal: Math.round(precioFinal),
      cuotaCalculada: Math.round(cuotaCalculada),
    };
  };

  const instalarApp = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === "accepted") {
    console.log("Instalada ✅");
  } else {
    console.log("Cancelada ❌");
  }

  setDeferredPrompt(null);
  setInstalable(false);
};

const copiarTexto = (data: Presupuesto) => {
  const { precioFinal, cuotaCalculada } = calcularFinal();
  const rec = Number(recargo) || 0;
  const valorOriginal = parseFloat(valor) || 0;
  const hoy = new Date();
const validez = new Date(hoy);
validez.setDate(hoy.getDate() + 3);

  const ahorro = tipoPago === "contado"
    ? Math.round((valorOriginal * Number(descuento || 0)) / 100)
    : 0;

  return `             Cetrogar 

📄 Presupuesto - ${new Date().toLocaleDateString("es-AR")}
${modelo ? `🏍️ Motocicleta: ${modelo}\n` : ""}
💰 Valor de la operación: $${format(valorOriginal)}${
  tipoPago === "tarjeta"
    ? `

💳 Tarjeta de crédito
🔢 ${
      rec === 0
        ? `${cuotas} cuotas sin interés de $${format(cuotaCalculada)}`
        : `${cuotas} cuotas fijas de $${format(cuotaCalculada)}`
    }
${rec > 0 ? `📈 Recargo: ${rec}%` : ""}
💰 Total financiado: $${format(precioFinal)}`
    : ""
}${
  tipoPago === "contado" && ahorro > 0
    ? `

💸 Descuento aplicado: ${descuento}%
💰 Ahorro: -$${format(ahorro)}
💵 Total con descuento: $${format(precioFinal)}`
    : ""
}

📄 Patentamiento y sellado(*): $${format(data.totalFormularios)}
🏛️ RUNA(**): $${format(data.runa)}

Entrega estimada: inmediata / 48 hs

*Patentamiento, sellado y RUNA son costos obligatorios exigidos para el registro y circulación legal del motovehículo.

Incluye:
• Formularios y gestión administrativa
• Impuesto de sellos provincial
• Inscripción del motovehículo
• Grabado obligatorio (RUNA**)
• Placa patente metálica

**Registro único nacional del automotor.

📌 Valores sujetos a condiciones vigentes y cambios sin previo aviso

Cetrogar · Justa Lima 337, Zárate
Asesor comercial: Brian Gómez

Si te interesa, podemos avanzar hoy mismo y dejar la unidad reservada. 
Cualquier duda, estoy para ayudarte.`
};
// const enviarWhatsApp = (data: Presupuesto) => {
//   if (!telefono) {
//     alert("Ingresá un número");
//     return;
//   }

//   const texto = copiarTexto(data);
// const numero = "54" + telefono.replace(/\D/g, "");
//   const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
//   window.open(url, "_blank");
// };
const enviarWhatsApp = (data: Presupuesto) => {
  if (!telefono) {
    alert("Ingresá un número");
    return;
  }

  const textoOriginal = copiarTexto(data);
  const textoSinEmojis = quitarEmojis(textoOriginal);

  const numero = "54" + telefono.replace(/\D/g, "");

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(textoSinEmojis)}`;
  window.open(url, "_blank");
};

  const { precioFinal, cuotaCalculada } = calcularFinal();
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0B1320] text-white">
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-500">Cetrogar</p>
          <p className="text-sm opacity-70">Motos</p>
        </div>
      </div>
    );
  }
  return (
<div className="min-h-screen flex items-start justify-center pt-10 pb-20 bg-gradient-to-br from-gray-100 to-gray-200">
      {copiado && (
  <div className="fixed top-5 right-5 z-[9999] animate-in fade-in slide-in-from-top-2 bg-black/90 text-white px-4 py-2 rounded-xl shadow-xl backdrop-blur">
    ✅ Copiado
  </div>
)}

      <div className="bg-white/90 backdrop-blur p-6 rounded-3xl shadow-xl w-90 space-y-6 border border-gray-200">

        {/* <h1 className="text-center text-xl font-semibold text-gray-800">
          Cálculo de patentamiento
        </h1> */}
        <div className="flex items-center mt-4">
  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-gray-300" />
  
  <p className="px-3 py-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">
    Cálculo de patentamiento
  </p>
  
  <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-gray-300" />
</div>
<input
  type="text"
  placeholder="Ej: Motomel S2 150cc"
  value={modelo}
  onChange={(e) => setModelo(e.target.value)}
  className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

        <input
          type="number"
          placeholder="Monto de la operación"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:scale-[1.01]"        />
{/* <p className="text-xs text-gray-500 mt-1">
  Total = ${format(parseFloat(valor) || 0)} {tipoPago === "tarjeta" && `+ ${recargo}%`}
</p> */}
        {/* SELECTOR */}
        <div className="relative flex bg-gray-100 p-1 rounded-xl">
        <div
  className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow transition-all duration-300 ${
    tipoPago === "contado" ? "left-1" : "left-1/2"
  }`}
/>

          {["contado", "tarjeta"].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setTipoPago(tipo as any)}
              className={`relative z-10 flex-1 py-2 text-sm font-medium ${
                tipoPago === tipo ? "text-gray-900" : "text-gray-500"
              }`}
            >
              {tipo === "contado" ? "Contado" : tipo === "credito" ? "Crédito" : "Tarjeta"}
            </button>
          ))}
        </div>

        <div className="transition-all duration-500 overflow-hidden">

          {/* CONTADO */}
          <div className={`transition-all duration-300 ${
            tipoPago === "contado"
              ? "max-h-40 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}>
  
            <input
              type="number"
              placeholder="Descuento (%)"
              value={descuento}
              onChange={(e) => setDescuento(e.target.value)}
className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"  />
          </div>

          {/* CUOTAS */}
          <div className={`transition-all duration-300 ${
            tipoPago !== "contado"
              ? "max-h-40 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}>
<div className="flex items-center mt-4">
  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-gray-300" />
  
  <p className="px-3 py-1 text-xs font-semibold text-gray-600 uppercase tracking-wide">
    Cuotas
  </p>
  
  <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-gray-300" />
</div>
          <div className="grid grid-cols-4 gap-2 mt-2">
  {[3,6,9,12,15,18,21,24].map((c)=>(
    <button
      key={c}
      onClick={()=>setCuotas(String(c))}
   className={`py-1 px-2 rounded-lg text-xs border transition-all duration-200 ${
  cuotas===String(c)
    ? "bg-blue-500 text-white shadow-md -translate-y-0.5 border-blue-500"
    : "bg-white hover:bg-gray-100 hover:-translate-y-0.5 border-gray-400"
}`}
    >
      {c}
    </button>
  ))}
</div>
          </div>

          {/* TARJETA */}
          <div className={`transition-all duration-300 ${
            tipoPago === "tarjeta"
              ? "max-h-40 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}>
            <input
              type="number"
              placeholder="Recargo (%)"
              value={recargo}
              onChange={(e)=>setRecargo(e.target.value || "0")}
className="w-full px-4 py-3 my-4 rounded-xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 focus:border-blue-500"/>          
          </div>

        </div>

        {data && (
  <div className="text-sm space-y-2">

  <p className="flex items-center gap-2">
    <Wallet size={16} />Total: <strong>${format(precioFinal)}</strong>
  </p>

  {tipoPago === "contado" && ahorro > 0 && (
    <p className="flex items-center gap-2 text-green-600 text-xs">
      <TrendingDown size={14} />
      Ahorro por descuento:<strong>${format(ahorro)}</strong>({descuento}% OFF)
    </p>
  )}
  {tipoPago !== "contado" && (
    <p className="flex items-center gap-2">
      <CreditCard size={16} /> Cuota: <strong>${format(cuotaCalculada)}</strong>
    </p>
  )}

  <p className="flex items-center gap-2">
    <Percent size={16} />Aplicado: <strong>{data.porcentaje}%</strong>
  </p>

  <p className="flex items-center gap-2">
    <FileText size={16} /> Formularios: <strong>${format(data.totalFormularios)}</strong>
  </p>

  <p className="flex items-center gap-2">
    <Landmark size={16} /> RUNA: <strong>${format(data.runa)}</strong>
  </p>
<input
  type="tel"
  placeholder="Ej: 11 1234 5678"
  value={telefono}
  onChange={(e) => setTelefono(e.target.value)}
  className="w-full px-4 py-3 rounded-xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
/>
<button
  onClick={() => {
    if (!deshabilitado && data) {
      const texto = copiarTexto(data);
      navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  }}
  disabled={deshabilitado}
  className={`w-full p-3 rounded-xl mt-3 shadow-md transition ${
    deshabilitado
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-[1.02] active:scale-[0.98]"
  }`}
>
  Copiar presupuesto
</button>
<button
  onClick={() => data && enviarWhatsApp(data)}
  disabled={!telefono || deshabilitado}
  className={`w-full p-3 rounded-xl mt-2 shadow-md transition ${
    !telefono || deshabilitado
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-green-600 text-white hover:scale-[1.02] active:scale-[0.98]"
  }`}
>
  Enviar por WhatsApp
</button>

   <button
  onClick={resetear}
  className="w-full flex items-center justify-center gap-2 bg-gray-500 shadow-md hover:scale-[1.02] active:scale-[0.98] text-gray-100 p-3 rounded-xl mt-2 hover:bg-red-700 transition"
>
  <RotateCcw size={16} />
  Resetear
</button>
  </div>
)}
{instalable && !window.matchMedia("(display-mode: standalone)").matches && (
  <button
    onClick={instalarApp}
    className="w-full p-3 rounded-xl mt-2 shadow-md bg-blue-600 text-white"
  >
    📲 Instalar app
  </button>
)}

        <p className="text-center text-xs text-gray-400 mt-4 opacity-0 animate-fadeUp delay-500 transition-all duration-300 hover:text-gray-600">
  Developed by Brian Gómez · Cetrogar Zárate
</p>


      </div>
    </div>
  );
}