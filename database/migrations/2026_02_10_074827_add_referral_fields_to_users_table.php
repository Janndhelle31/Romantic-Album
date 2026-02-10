<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('referral_code')->nullable()->unique()->after('email');
            $table->foreignId('referred_by')->nullable()->after('referral_code')->constrained('users');
            $table->integer('referral_count')->default(0)->after('referred_by');
            $table->decimal('referral_earnings', 10, 2)->default(0.00)->after('referral_count');
            $table->tinyInteger('is_paid')->default(0)->after('referral_earnings');
            $table->string('payment_reference')->nullable()->after('is_paid');
            $table->string('payment_proof_path')->nullable()->after('payment_reference');
            $table->string('payment_status')->default('pending')->after('payment_proof_path');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'referral_code',
                'referred_by',
                'referral_count',
                'referral_earnings',
                'is_paid',
                'payment_reference',
                'payment_proof_path',
                'payment_status'
            ]);
        });
    }
};