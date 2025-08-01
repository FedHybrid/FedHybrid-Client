import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server';
import { authorize } from "@/lib/supabase/authHelpers";

/** 소유 인스턴스 갱신 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    // supabase 연결 및 인가
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { granted, response: errRes, user } = await authorize(request, supabase);
    if (!granted) return errRes;

    // DTO & URL 언패킹
    const body = await request.json();
    const { name, ip_address, port } = body;
    const owner_id = user.id;
    const id = params.id;

    // 인스턴스 갱신
    const { data, error } = await supabase
        .from("instances")
        .update([{ name, ip_address, port }])
        .eq('owner_id', owner_id)
        .eq('id', id)
        .select().single();
    if (error) {
        console.log(error.message);
        return NextResponse.json({ error: "인스턴스 갱신 중 문제가 발생했습니다." }, { status: 400 });
    }
    return NextResponse.json(data);
}

/** 소유 인스턴스 삭제 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    // supabase 연결 및 인가
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { granted, response: errRes, user } = await authorize(request, supabase);
    if (!granted) return errRes;

    // URL 파라미터 획득
    const id = params.id;

    // 인스턴스 삭제
    const { data, error } = await supabase.from("instances").delete().eq('id', id);
    if (error) return NextResponse.json({ error: "인스턴스 삭제에 실패했습니다." }, { status: 400 });
    return new NextResponse(null, { status: 204 });
}