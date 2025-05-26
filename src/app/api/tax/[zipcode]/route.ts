import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/db/conn"; 
import dbConfig from "@/db/dbConfig"; 
import { getToken } from "next-auth/jwt";
import Taxjar from 'taxjar';
import zipcodes from 'zipcodes';


function getStateFromZip(zip: string): string | null {
  const lookup = zipcodes.lookup(zip);
  return lookup ? lookup.state : null;
}

export async function GET(request: NextRequest, { params }: { params: { zipcode: string }}) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  let db = null;

  if (!token) {
    return NextResponse.json({ message: "Access denied." }, { status: 401 });
  }
  try {
    const toState = getStateFromZip(params.zipcode);

    if (!toState) {
      return NextResponse.json({ message: "Invalid ZIP code." }, { status: 400 });
    }
    
    const client = new Taxjar({
      apiKey: process.env.TAXJAR_API_KEY || ""
    });

    
    db = getDBConnection(dbConfig());
    const { Estado: empState, Cidade: empCity, Endereco: empAddress, Cep: empZipCcode, Idioma: country } = await db("Empresa").first();

    console.log(empZipCcode, empState, empCity, empAddress, params.zipcode, toState)
    const res = await client.taxForOrder({
      from_country: 'US',
      from_zip: empZipCcode || 32821,
      from_state: empState,
      from_city: empCity,
      from_street: empAddress,
      to_country: 'US',
      to_zip: params.zipcode,
      to_state: toState,
      to_city: 'Ramsey',
      to_street: '63 W Main St',
      amount: 16.50,
      shipping: 1.5,
      line_items: [
        {
          id: '1',
          quantity: 1,
          product_tax_code: '31000',
          unit_price: 15.0,
          discount: 0
        }
      ]
    });

    console.log(res)

    const tax = res.tax.amount_to_collect;
    return NextResponse.json({ rate: tax }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
