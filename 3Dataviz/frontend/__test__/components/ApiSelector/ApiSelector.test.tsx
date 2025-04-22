import { beforeEach, describe, expect, it } from "vitest";
import { DatasetInfo } from "../../../src/features/DataSource/types/DatasetInfo";
import { useSelector } from "react-redux";
import { selectorDatasets } from "../../../src/features/DataSource/DataSourceSlice";
import { render, screen, fireEvent } from "@testing-library/react";
import ApiSelector from "../../../src/components/apiSelector/apiSelector";

describe("ApiSelector", () => {
  it("carica correttamente i dataset disponibili", () => {});
  it("dovrebbe impostare correttamente il dataset selezionato", () => {});
});
