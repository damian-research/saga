export interface NaraQueryInput {
  q?: string;
  naId?: string;
  localId?: string;
  microfilmId?: string;
  levelOfDescription?: string;
  recordGroupNumber?: string;
  personOrOrg?: string;
  dataSource?: string;
  title?: string;
  onlineAvailable?: boolean;
}
export function buildNaraQuery(form: NaraQueryInput): string {
  const clauses: string[] = [];

  if (form.q && form.q.trim()) {
    clauses.push(form.q.trim());
  }

  if (form.naId) {
    const ids = form.naId
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    ids.forEach((id) => clauses.push(`naId:${id}`));
  }

  if (form.levelOfDescription) {
    clauses.push(`level:${form.levelOfDescription}`);
  }

  if (form.recordGroupNumber) {
    const rgs = form.recordGroupNumber
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    rgs.forEach((rg) => clauses.push(`recordGroupNumber:${rg}`));
  }

  if (form.microfilmId) {
    const mfs = form.microfilmId
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    mfs.forEach((m) => clauses.push(`microformPublicationsIdentifier:${m}`));
  }

  if (form.localId) {
    const locals = form.localId
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    locals.forEach((l) => clauses.push(`localIdentifier:${l}`));
  }

  if (form.personOrOrg) {
    clauses.push(`personOrOrg:${form.personOrOrg.trim()}`);
  }

  if (form.dataSource) {
    clauses.push(`dataSource:${form.dataSource.trim()}`);
  }

  if (form.title?.trim()) {
    clauses.push(`title:${form.title.trim()}`);
  }

  if (form.onlineAvailable === true) {
    clauses.push(`availableOnline:true`);
  }

  if (clauses.length === 0) {
    return "*";
  }

  return clauses.join(" AND ");
}

function appendIsOrMulti(params: URLSearchParams, base: string, raw: string) {
  const values = raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  if (values.length === 1) {
    params.set(`${base}_is`, values[0]);
  } else if (values.length > 1) {
    params.set(base, values.join(","));
  }
}
