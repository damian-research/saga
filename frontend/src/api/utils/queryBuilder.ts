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
export function buildNaraQ(form: NaraQueryInput): string {
  return form.q?.trim() || "*";
}

export function buildNaraParams(form: NaraQueryInput): URLSearchParams {
  const params = new URLSearchParams();

  if (form.levelOfDescription) {
    params.set("level", form.levelOfDescription);
  }

  if (form.recordGroupNumber) {
    params.set("recordGroupNumber", form.recordGroupNumber);
  }

  if (form.naId) {
    params.set("naId", form.naId);
  }

  if (form.localId) {
    params.set("localId", form.localId);
  }

  if (form.microfilmId) {
    params.set("microfilmId", form.microfilmId);
  }

  if (form.personOrOrg) {
    params.set("personOrOrg", form.personOrOrg);
  }

  if (form.dataSource) {
    params.set("dataSource", form.dataSource);
  }

  if (form.title) {
    params.set("title", form.title);
  }

  if (form.onlineAvailable === true) {
    params.set("availableOnline", "true");
  }

  return params;
}
