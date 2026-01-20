import { apiSlice } from "@/services/base-query";
import { PaginatedResponse } from "@/types/pagination";
import { Campaign, GetCampaignsParams } from "@/types/public/campaign";
import {
  CampaignDonation,
  GetCampaignDonationsParams,
  CreateDonationBody,
} from "@/types/public/donation";

export const campaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🎯 Get Campaigns List
    // Endpoint: /public/campaigns?paginate=10&page=1
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
        throw new Error(
          response.message || "Gagal mengambil daftar campaign."
        );
      },
      providesTags: ["Campaigns"],
    }),

    // 📋 Get Campaign Donations
    // Endpoint: /public/campaigns/:campaign/donations?page=1&paginate=10
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
        throw new Error(
          response.message || "Gagal mengambil riwayat donasi."
        );
      },
      providesTags: (result, error, { campaign }) => [
        { type: "CampaignDonations", id: campaign },
      ],
    }),

    // 💰 Create Donation
    // Endpoint: /public/campaigns/:campaign/donate
    createDonation: builder.mutation<any, { campaign: number; body: CreateDonationBody }>({
      query: ({ campaign, body }) => ({
        url: `/public/campaigns/${campaign}/donate`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { campaign }) => [
        "Campaigns",
        { type: "CampaignDonations", id: campaign },
      ],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignDonationsQuery,
  useCreateDonationMutation,
} = campaignApi;
