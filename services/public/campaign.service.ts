import { apiSlice } from "@/services/base-query";
import { PaginatedResponse } from "@/types/pagination";
import { Campaign, GetCampaignsParams } from "@/types/public/campaign";
import {
  CampaignDonation,
  GetCampaignDonationsParams,
  CreateDonationBody,
} from "@/types/public/donation";

// --- TYPES & INTERFACES ---

// Interface umum untuk response standar { code, message, data }
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const campaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. 🎯 Get Campaigns List (Get All)
    // URL: /public/campaigns
    getCampaigns: builder.query<
      PaginatedResponse<Campaign>["data"],
      GetCampaignsParams
    >({
      query: (params) => ({
        url: "/public/campaigns",
        method: "GET",
        params: {
          page: params.page ?? 1,
          paginate: params.paginate ?? 10,
        },
      }),
      transformResponse: (response: PaginatedResponse<Campaign>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil daftar campaign.");
      },
      providesTags: ["Campaigns"],
    }),

    // 2. 🔍 Get Campaign Detail (By ID) - [BARU DITAMBAHKAN]
    // URL: /public/campaigns/:campaign
    getCampaignDetail: builder.query<Campaign, number>({
      query: (campaignId) => ({
        url: `/public/campaigns/${campaignId}`,
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Campaign>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil detail campaign.");
      },
      providesTags: (result, error, id) => [{ type: "Campaigns", id }],
    }),

    // 3. 📋 Get Campaign Donations List
    // URL: /public/campaigns/:campaign/donations
    getCampaignDonations: builder.query<
      PaginatedResponse<CampaignDonation>["data"],
      GetCampaignDonationsParams
    >({
      query: ({ campaign, page, paginate }) => ({
        url: `/public/campaigns/${campaign}/donations`,
        method: "GET",
        params: {
          page: page ?? 1,
          paginate: paginate ?? 10,
        },
      }),
      transformResponse: (response: PaginatedResponse<CampaignDonation>) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil riwayat donasi.");
      },
    }),

    // 4. 📄 Get Single Donation Detail - [BARU DITAMBAHKAN]
    // URL: /public/campaign/donations/:donation
    // Note: URL ini sedikit berbeda strukturnya (/campaign/ singlar vs /campaigns/ plural di endpoint lain)
    getDonationDetail: builder.query<
      CampaignDonation & { campaign: Campaign }, // Response includes campaign relation
      number
    >({
      query: (donationId) => ({
        url: `/public/campaign/donations/${donationId}`,
        method: "GET",
      }),
      transformResponse: (
        response: ApiResponse<CampaignDonation & { campaign: Campaign }>,
      ) => {
        if (response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal mengambil detail donasi.");
      },
    }),

    // 5. 💰 Create Donation
    // URL: /public/campaigns/:campaign/donate
    createDonation: builder.mutation<
      CampaignDonation, // Response data is the donation object inside `data`
      { campaign: number; body: CreateDonationBody }
    >({
      query: ({ campaign, body }) => ({
        url: `/public/campaigns/${campaign}/donate`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<CampaignDonation>) => {
        if (response.code === 201 || response.code === 200) {
          return response.data;
        }
        throw new Error(response.message || "Gagal membuat donasi.");
      },
    }),

    // 6. ❤️ Toggle Favorite Campaign
    // URL: /user/toggle-favorite-campaign
    toggleFavoriteCampaign: builder.mutation<
      { code: number; message: string; data: unknown },
      { campaign_id: number }
    >({
      query: (body) => ({
        url: "/user/toggle-favorite-campaign",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Campaigns"],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignDetailQuery,
  useGetCampaignDonationsQuery,
  useGetDonationDetailQuery,
  useCreateDonationMutation,
  useToggleFavoriteCampaignMutation,
} = campaignApi;