import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

const VALID_PLANT_IDS = ["basil", "tomato"];

export async function POST(request) {
  const { password, stage, plantId } = await request.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  if (!VALID_PLANT_IDS.includes(plantId)) {
    return NextResponse.json({ error: "plantId가 올바르지 않습니다." }, { status: 400 });
  }

  const stageNum = Number(stage);
  if (!Number.isInteger(stageNum) || stageNum < 0 || stageNum > 5) {
    return NextResponse.json(
      { error: "stage는 0~5 사이의 정수여야 합니다." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("plant_growth")
    .upsert({ id: plantId, stage: stageNum, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, stage: stageNum });
}
