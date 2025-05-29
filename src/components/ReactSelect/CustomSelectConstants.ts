import { StylesConfig } from 'react-select';

export const colorStyles: StylesConfig = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #E5E7EB',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    backgroundColor: state.isSelected
      ? '#F9FAFB' // Cor de fundo quando selecionado
      : state.isFocused
      ? '#DDDDDD' // Cor de fundo quando focado (equivalente ao bg-white-dark)
      : 'transparent', // Fundo transparente quando não está focado ou selecionado
    color: state.isSelected
      ? 'black' // Cor do texto quando selecionado
      : state.isFocused
      ? 'black' // Cor do texto quando focado
      : 'gray', // Cor padrão do texto
    ':active': {
      ...provided[':active'],
      backgroundColor: '#DDDDDD', // Cor de fundo para quando clicado (similar ao hover)
    },
  }),

  // Estilos para o controle (input/select)
  control: (provided, state) => ({
    ...provided,
    cursor: 'text',
    boxShadow: "rgba(0, 0, 0, 0.20) 5px 5px 7px",
    maxWidth: '100%',
    backgroundColor: '#EAEAEA',
    borderRadius: '15px',
    fontSize: '1.125rem',
    lineHeight: '1.75rem',
    border: "none",
    padding: "0 0 0 0.45rem",
  }),

  // Estilos para o placeholder
  placeholder: (provided) => ({
    ...provided,
    color: '#9CA3AF', // Cor do placeholder
  }),

  // Estilos para valores múltiplos
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'transparent',
    border: '1px solid #E5E7EB', // Borda suave
    borderRadius: '12px',
  }),

  // Estilos para remover valores múltiplos
  multiValueRemove: (base) => ({
    ...base,
    border: '1px dotted #F9AAAA', // Borda pontilhada para remoção
  }),
}; 
