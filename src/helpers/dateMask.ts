 const dateMask = (value: string, locale: string) => {
    let cleaned = value.replace(/\D/g, "");
    let day = "", month = "", year = "";
  
    if (locale === "pt-BR") {
      day = cleaned.slice(0, 2);
      month = cleaned.slice(2, 4);
      year = cleaned.slice(4, 8);
    } else if (locale === "en-US") {
      month = cleaned.slice(0, 2);
      day = cleaned.slice(2, 4);
      year = cleaned.slice(4, 8);
    } else {
      return cleaned;
    }
  
    if (parseInt(month) > 12) month = "12";
  
    if (parseInt(day) > 31) day = "31";
  
    if (["04", "06", "09", "11"].includes(month) && parseInt(day) > 30) {
      day = "30";
    }
  
    if (month === "02") {
      let maxDays = 28;
      if (year.length === 4) {
        const numYear = parseInt(year);
        if ((numYear % 4 === 0 && numYear % 100 !== 0) || numYear % 400 === 0) {
          maxDays = 29;
        }
      }
      if (parseInt(day) > maxDays) day = maxDays.toString();
    }
  
    if (year.length === 4 && (parseInt(year) < 1900 || parseInt(year) > 2099)) {
      year = "";
    }
  
    return locale === "pt-BR"
      ? `${day}${month ? "/" + month : ""}${year ? "/" + year : ""}`
      : `${month}${day ? "/" + day : ""}${year ? "/" + year : ""}`;
  };

  function dateMaskFormat(value: string, locale: any): string {
    // 1) Detecta ISO date (YYYY-MM-DD ou YYYY-MM-DD[ T ]hh:mm:ss...)
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      let iso = value.trim().replace(" ", "T");
      if (!/[Zz±]/.test(iso.slice(10))) iso += "Z";
  
      const d = new Date(iso);
      if (!isNaN(d.getTime())) {
        const dd = String(d.getUTCDate()).padStart(2, "0");
        const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
        const yyyy = d.getUTCFullYear();
        return locale === "pt-BR" ? `${dd}/${mm}/${yyyy}` : `${mm}/${dd}/${yyyy}`;
      }
      return value;
    }
  
    // 2) Senão, é digitação manual: máscara progressiva
    const digits = value.replace(/\D/g, "");
    const len = digits.length;
  
    const clamp = (num: number, min: number, max: number) =>
      Math.max(min, Math.min(num, max));
  
    if (locale === "pt-BR") {
      let d = digits.slice(0, 2);
      let m = digits.slice(2, 4);
      const y = digits.slice(4, 8);
  
      if (d.length === 2) d = String(clamp(Number(d), 1, 31)).padStart(2, "0");
      if (m.length === 2) m = String(clamp(Number(m), 1, 12)).padStart(2, "0");
  
      if (len <= 2) return d;
      if (len <= 4) return `${d}/${m}`;
      return `${d}/${m}/${y}`;
    } else {
      let m = digits.slice(0, 2);
      let d = digits.slice(2, 4);
      const y = digits.slice(4, 8);
  
      if (m.length === 2) m = String(clamp(Number(m), 1, 12)).padStart(2, "0");
      if (d.length === 2) d = String(clamp(Number(d), 1, 31)).padStart(2, "0");
  
      if (len <= 2) return m;
      if (len <= 4) return `${m}/${d}`;
      return `${m}/${d}/${y}`;
    }
  }
  

export {dateMaskFormat, dateMask};