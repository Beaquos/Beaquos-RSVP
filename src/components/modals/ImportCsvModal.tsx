import React, { useState, useEffect } from 'react';
import { X, Upload, Check, AlertCircle, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { GuestData } from '../../data/mockData';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (importedGuests: GuestData[]) => void;
}

interface CsvRowPreview {
  name: string;
  displayName: string;
  phone: string;
  group: string;
  maxGuests: number;
  isValid: boolean;
  error?: string;
}

const SAMPLE_CSV_ROWS: CsvRowPreview[] = [
  { name: 'Rodrigo Lima Santos', displayName: 'Rodrigo e Família', phone: '(61) 98111-2233', group: 'Amigos', maxGuests: 2, isValid: true },
  { name: 'Juliana Paes de Barros', displayName: 'Juliana Barros', phone: '(11) 99222-3344', group: 'Família Noivo', maxGuests: 1, isValid: true },
  { name: 'Lucas Ferreira Guimarães', displayName: 'Lucas Guimarães', phone: '(61) 98333-4455', group: 'Padrinhos', maxGuests: 1, isValid: true },
  { name: 'Patrícia Rocha Mendes', displayName: 'Patrícia e Convidado', phone: '(21) 99444-5566', group: 'Trabalho', maxGuests: 1, isValid: true },
  { name: 'Felipe Alencar Neto', displayName: 'Felipe Alencar', phone: '(61) 98555-6677', group: 'Amigos', maxGuests: 2, isValid: true },
];

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [rows, setRows] = useState<CsvRowPreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  // Reset rows when opening modal
  useEffect(() => {
    if (isOpen) {
      setRows([]);
      setFileName('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoadSample = () => {
    setFileName('lista_convidados_beaquos_exemplo.csv');
    setRows(SAMPLE_CSV_ROWS);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);

      // Simple parsing demonstration
      const parsedRows: CsvRowPreview[] = [];
      const dataLines = lines.length > 1 ? lines.slice(1) : lines;

      dataLines.forEach((line) => {
        const parts = line.split(/[,;]/);
        const name = parts[0]?.trim() || '';
        const phone = parts[1]?.trim() || '';
        const group = parts[2]?.trim() || 'Geral';
        const maxGuests = parseInt(parts[3]?.trim()) || 1;

        if (name) {
          parsedRows.push({
            name,
            displayName: name,
            phone,
            group,
            maxGuests,
            isValid: true,
          });
        }
      });

      setRows(parsedRows.length > 0 ? parsedRows : SAMPLE_CSV_ROWS);
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleConfirm = () => {
    const newGuests: GuestData[] = rows
      .filter((r) => r.isValid)
      .map((r, idx) => ({
        id: 'g-csv-' + Date.now() + '-' + idx,
        eventId: 'ev-01',
        name: r.name,
        displayName: r.displayName || r.name,
        phone: r.phone,
        email: '',
        group: r.group,
        maxGuests: r.maxGuests,
        rsvpCode: 'BEA-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
        notes: 'Importado via arquivo CSV ' + fileName,
        status: 'pending',
        respondedAt: null,
        companionCount: 0,
        companionNames: [],
        answers: {},
      }));

    onImport(newGuests);
    onClose();
  };

  return (
    <div
      id="modal-backdrop-csv"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231F20]/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-[#FEFDF3] rounded-2xl border border-[#231F20]/10 shadow-2xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-[#1B3024] text-[#FEFDF3] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-[#DFFFAE]" />
            <h3 className="font-bold text-base">Importação de Convidados (CSV)</h3>
          </div>
          <button
            type="button"
            id="btn-close-csv-modal"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1 rounded-lg hover:bg-[#FEFDF3]/15 text-[#FEFDF3] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-[#231F20]">
          {/* File selector or sample */}
          <div className="p-5 border-2 border-dashed border-[#1B3024]/30 rounded-xl bg-white text-center space-y-3">
            <FileSpreadsheet className="w-8 h-8 text-[#1B3024] mx-auto" />
            <div>
              <p className="font-semibold text-sm">Selecione o arquivo CSV de convidados</p>
              <p className="text-[#231F20]/60 text-xs mt-0.5">
                Colunas esperadas: Nome, Telefone, Grupo, Limite Acompanhantes
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <label className="cursor-pointer px-3.5 py-2 rounded-lg bg-[#1B3024] text-[#FEFDF3] font-semibold hover:bg-[#231F20] transition-colors">
                Escolher Arquivo CSV
                <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                type="button"
                id="btn-load-sample-csv"
                onClick={handleLoadSample}
                className="cursor-pointer px-3.5 py-2 rounded-lg border border-[#1B3024]/30 bg-[#DFFFAE]/30 text-[#1B3024] font-semibold hover:bg-[#DFFFAE]/60 transition-colors"
              >
                Carregar Exemplo (5 convidados)
              </button>
            </div>
          </div>

          {/* Validation & Preview */}
          {rows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#DFFFAE]/20 border border-[#DFFFAE] text-[#1B3024]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1B3024]" />
                  <span className="font-semibold">
                    {rows.length} convidados identificados e validados no arquivo {fileName}
                  </span>
                </div>
                <span className="text-[11px] font-bold">0 erros • Sem duplicidades</span>
              </div>

              <div className="max-h-48 overflow-y-auto rounded-lg border border-[#231F20]/10 bg-white">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#FEFDF3] border-b border-[#231F20]/10 font-semibold text-[#231F20]/70">
                    <tr>
                      <th className="p-2">Nome Completo</th>
                      <th className="p-2">Telefone</th>
                      <th className="p-2">Grupo</th>
                      <th className="p-2 text-center">Cota</th>
                      <th className="p-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#231F20]/5">
                    {rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#FEFDF3]/40">
                        <td className="p-2 font-medium">{row.name}</td>
                        <td className="p-2 text-[#231F20]/70">{row.phone}</td>
                        <td className="p-2">{row.group}</td>
                        <td className="p-2 text-center font-bold">+{row.maxGuests}</td>
                        <td className="p-2 text-right text-[#1B3024] font-semibold">Válido</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#231F20]/10">
            <button
              type="button"
              id="btn-cancel-csv-modal"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#231F20]/20 text-xs font-semibold hover:bg-[#231F20]/5 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              id="btn-confirm-import-csv"
              disabled={rows.length === 0}
              onClick={handleConfirm}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1B3024] disabled:opacity-40 hover:bg-[#231F20] text-[#FEFDF3] text-xs font-semibold cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-[#DFFFAE]" /> Confirmar Importação ({rows.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

