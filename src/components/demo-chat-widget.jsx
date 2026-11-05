"use client";

import { useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";

export default function DemoChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {isOpen && (
        <section
          aria-label="CareConnect demo assistant"
          className="flex max-h-[min(650px,calc(100dvh-7rem))] w-[min(390px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[26px] border border-emerald-950/10 bg-white shadow-[0_24px_80px_-22px_rgba(12,44,35,0.38)]"
          role="dialog"
          aria-modal="false"
        >
          <header className="flex items-center justify-between bg-[#123b33] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-white/10 text-emerald-100">
                <Sparkles aria-hidden="true" size={19} />
              </span>
              <div>
                <h2 className="text-sm font-semibold">CareConnect assistant</h2>
                <p className="mt-0.5 text-xs text-emerald-100/75">
                  Demo preview
                </p>
              </div>
            </div>
            <button
              aria-label="Close demo chat"
              className="flex size-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X aria-hidden="true" size={19} />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[#f7f9f6] p-5">
            <div className="mx-auto w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-900">
              Demo only · replies are not enabled
            </div>
            <div className="flex items-end gap-2">
              <span className="mb-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-emerald-50">
                <Sparkles aria-hidden="true" size={13} />
              </span>
              <div className="max-w-[84%] rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">
                Hi there! I can help you find your way around CareConnect.
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[84%] rounded-2xl rounded-br-md bg-emerald-900 px-4 py-3 text-sm leading-6 text-white">
                I&apos;d like to find a doctor.
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="mb-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-emerald-50">
                <Sparkles aria-hidden="true" size={13} />
              </span>
              <div className="max-w-[84%] rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm">
                You can browse approved providers, view their available times,
                and request an appointment from the Doctors page.
                <span className="mt-2 block text-xs text-slate-400">
                  Sample conversation
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-3 text-center text-xs leading-5 text-slate-500">
              This is a visual demo. Chat messages are not sent, and no AI
              assistant is connected.
            </div>
          </div>

          <div className="border-t border-slate-100 bg-white p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
              <input
                aria-label="Demo chat message (disabled)"
                className="h-9 min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-500 outline-none placeholder:text-slate-400"
                disabled
                placeholder="Chat is not connected yet"
                type="text"
              />
              <button
                aria-label="Send message (disabled)"
                className="flex size-9 shrink-0 cursor-not-allowed items-center justify-center rounded-xl bg-slate-200 text-slate-400"
                disabled
                type="button"
              >
                <Send aria-hidden="true" size={16} />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Preview interface · not for medical advice
            </p>
          </div>
        </section>
      )}

      <button
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close demo chat" : "Open demo chat"}
        className="group inline-flex h-14 items-center gap-3 rounded-full bg-emerald-900 px-5 text-sm font-semibold text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-800"
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isOpen ? (
          <X aria-hidden="true" size={19} />
        ) : (
          <MessageCircle aria-hidden="true" size={20} />
        )}
        <span>{isOpen ? "Close demo" : "Chat demo"}</span>
        {!isOpen && (
          <span className="absolute right-0 top-0 size-3 rounded-full border-2 border-[#fbfcf9] bg-amber-400" />
        )}
      </button>
    </div>
  );
}
